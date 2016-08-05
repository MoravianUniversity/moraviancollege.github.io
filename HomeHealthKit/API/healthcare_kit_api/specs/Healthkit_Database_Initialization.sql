# Make the database and switch to it
CREATE DATABASE healthkitData;
USE healthkitData;

# Create the users table, which holds pertinent information about each person who
# uses the healthkit to record their data
CREATE TABLE Users(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL UNIQUE,
	lastName VARCHAR(35) NOT NULL,
	middleInitial VARCHAR(1) NOT NULL,
	firstName VARCHAR(35) NOT NULL,
	birthdate DATE NOT NULL
);

# Blood Pressure Table
CREATE TABLE BloodPressureData(
	userID INT UNSIGNED NOT NULL,
	recordedTime DATETIME NOT NULL,
	diastolic TINYINT UNSIGNED NOT NULL,
	systolic TINYINT UNSIGNED NOT NULL,
	pulse TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (userID) REFERENCES Users(id),
	UNIQUE(userID, recordedTime)
);

# Recoveries + Recovery Data
# To add in data from a recovery, one must do a single
# 		INSERT INTO RecoveriesData (recordedTime, pulse) VALUES (,);
#	Then get the last auto id with LAST_INSERT_ID() 
#	and finally insert the rest of the data with
# 		INSERT INTO RecoveriesData (id, recordedTime, pulse) VALUES (,,);
CREATE TABLE RecoveriesData(
	id INT UNSIGNED AUTO_INCREMENT NOT NULL ,
	recordedTime DATETIME NOT NULL,
	pulse TINYINT UNSIGNED NOT NULL,
	UNIQUE(id, recordedTime)
);

CREATE TABLE Recoveries(
	userID INT UNSIGNED NOT NULL,
	dataID INT UNSIGNED NOT NULL,
	startTime DATETIME NOT NULL,
	endTime DATETIME NOT NULL,
	FOREIGN KEY (userID) REFERENCES Users(id),
	FOREIGN KEY (dataID) REFERENCES RecoveriesData(id),
	UNIQUE(userID, dataID)
);

CREATE VIEW RecoveryData AS
	SELECT a.userID, b.recordedTime, b.pulse FROM
	Recoveries a RIGHT JOIN RecoveriesData b
	ON a.dataID = b.id;


# Electrical Resistance Data
CREATE TABLE ElectricalResistanceData(
	userID INT UNSIGNED NOT NULL,
	recordedTime DATETIME NOT NULL,
	conductance FLOAT NOT NULL,
	resistance FLOAT NOT NULL,
	current FLOAT NOT NULL,
	FOREIGN KEY (userID) REFERENCES Users(id),
	UNIQUE(userID, recordedTime)
);