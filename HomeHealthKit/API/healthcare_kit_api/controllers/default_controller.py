import mysql.connector as connector
from datetime import datetime


def instantiate_connection():
    cnx = connector.connect(user='root', host='127.0.0.1', database='healthkitData')
    cursor = cnx.cursor(buffered=True)
    return cnx, cursor


def instantiate_unbuffered_connection():
    cnx = connector.connect(user='root', host='127.0.0.1', database='healthkitData')
    cursor = cnx.cursor()
    return cnx, cursor


def close_connection(cursor, cnx):
    # cursor = None
    cnx.close()


def valid_user_id(userID):
    try:
        if (userID is not None) and (isinstance(userID, int)):
            if userID <= 0:
                return False
            else:
                return True
        else:
            raise ValueError

    except ValueError:
        return False


def valid_int_params(params):
    try:
        for p in params:
            if (p is not None) and (isinstance(p, int)):
                return True
            else:
                raise ValueError

    except ValueError:
        return False


def valid_text_params(params):
    try:
        for p in params:
            if (p is not None) and (p.isalpha()):
                return True
            else:
                raise ValueError

    except ValueError:
        return False


def valid_date_params(dates):
    try:
        for d in dates:
            if d is not None:
                if len(d) == 19:
                    nd = datetime.strptime(d, "%Y-%m-%d %H:%M:%S")
                elif len(d) == 10:
                    nd = datetime.strptime(d, "%Y-%m-%d")
                else:
                    raise ValueError

        return True

    except ValueError:
        return False


def add_blood_pressure_post(userID, bloodPressureData) -> str:
    if not valid_user_id(userID):
        return "Invalid userID", 400

    try:
        date_params = [bloodPressureData[0]]
        int_params = [int(bloodPressureData[1]), int(bloodPressureData[2]), int(bloodPressureData[3])]
        if ((not valid_int_params(int_params)) and not valid_date_params(date_params)) or userID <= 0:
            return "Invalid parameters", 400

    except ValueError:
        return "Invalid parameters", 400

    query = "INSERT INTO BloodPressureData VALUES ({}, \"{}\", {}, {}, {})"
    query = query.format(userID, bloodPressureData[0], int(bloodPressureData[1]), int(bloodPressureData[2]), int(bloodPressureData[3]))

    cnx, cursor = instantiate_connection()

    user_query = "SELECT * FROM Users WHERE id = {}".format(userID)
    cursor.execute(user_query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    cursor.execute(query)
    cursor.fetchone

    cnx.commit()
    close_connection(cursor, cnx)
    return 'Success: Blood-pressure data was added', 201


def add_electrical_resistance_test_post(userID, electricalResistanceData) -> str:
    query = "INSERT INTO ElectricalResistanceData VALUES ({}, \"{}\", {}, {}, {})"
    query = query.format(userID, electricalResistanceData[0], float(electricalResistanceData[1]),
                         float(electricalResistanceData[2]), float(electricalResistanceData[3]))

    cnx, cursor = instantiate_connection()

    user_query = "SELECT * FROM Users WHERE id={}".format(userID)
    cursor.execute(user_query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    cursor.execute(query)

    cnx.commit()
    close_connection(cursor, cnx)
    return 'Success: Electrical-resistance data added', 201


def add_recovery_test_post(userID, recoveryTestData) -> str:
    cnx, cursor = instantiate_connection()

    user_query = "SELECT * FROM Users WHERE id={}".format(userID)
    cursor.execute(user_query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    startTime = recoveryTestData[0][0]
    endTime = None
    cursor.execute("INSERT INTO RecoveriesData (recordedTime, pulse) VALUES (\"{}\", {})".format(recoveryTestData[0][0], int(recoveryTestData[0][1])))

    cursor.execute("SELECT LAST_INSERT_ID()")
    data_id,  = cursor.fetchone()

    for i in range(1, len(recoveryTestData)):
        cursor.execute("INSERT INTO RecoveriesData VALUES ({}, \"{}\", {})".format(data_id, recoveryTestData[i][0], int(recoveryTestData[i][1])))
        if i == len(recoveryTestData) - 1:
            endTime = recoveryTestData[i][0]

    cursor.execute("INSERT INTO Recoveries VALUES ({}, {}, \"{}\", \"{}\")".format(userID, data_id, startTime, endTime))
    cnx.commit()

    return 'Success', 201


def add_user_post(lastName, middleInitial, firstName, birthdate) -> str:
    query = "INSERT INTO Users (lastName, middleInitial, firstName, birthdate) VALUES (\"{}\", \'{}\', \"{}\", \"{}\")".format(lastName, middleInitial, firstName, birthdate)

    cnx, cursor = instantiate_connection()
    cursor.execute(query)
    user_id = cursor.lastrowid

    cnx.commit()
    close_connection(cursor, cnx)

    return {'userID': user_id, 'lastName': lastName, 'middleInitial': middleInitial, 'firstName': firstName,
            'birthdate': birthdate}, 201


def get_blood_pressure_get(userID, startTime = None, endTime = None) -> str:
    if not valid_user_id(userID):
        return "Invalid userID", 400

    query = "SELECT recordedTime, diastolic, systolic, pulse FROM BloodPressureData WHERE userID = {}".format(userID)

    if startTime is not None:
        query += " AND recordedTime >= \"{}\"".format(startTime)
    if endTime is not None:
        query += " AND recordedTime < \"{}\"".format(endTime)

    cnx, cursor = instantiate_connection()
    cursor.execute(query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    close_connection(cursor, cnx)

    return [[time, dia, sys, pulse] for time, dia, sys, pulse, in cursor], 200


def get_electrical_resistance_get(userID, startTime = None, endTime = None) -> str:
    query = "SELECT recordedTime, conductance, resistance, current FROM ElectricalResistanceData WHERE userID = {}".format(userID)

    if startTime is not None:
        query += " AND recordedTime >= \"{}\"".format(startTime)
    if endTime is not None:
        query += " AND recordedTime < \"{}\"".format(endTime)

    cnx, cursor = instantiate_connection()
    cursor.execute(query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    close_connection(cursor, cnx)

    return [[time, cond, resis, curr] for time, cond, resis, curr, in cursor], 200


# It is unclear whether we would like to return all recovery tests that have data-points within the time-frame,
# or whether we would like to only return specific data-points within the time-frame. A 'return tests by test' method
# can be found in getrecoverytestbytest.py
def get_recovery_test_get(userID, startTime = None, endTime = None) -> str:
    query = "SELECT recordedTime, pulse FROM RecoveryData WHERE userID = {}".format(userID)

    if startTime is not None:
        query += " AND recordedTime >= \"{}\"".format(startTime)
    if endTime is not None:
        query += " AND recordedTime < \"{}\"".format(endTime)

    cnx, cursor = instantiate_connection()
    cursor.execute(query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    close_connection(cursor, cnx)

    return [[time, pulse] for time, pulse, in cursor], 200


def get_user_index_get(lastName = None, middleInitial = None, firstName = None, birthdate = None) -> str:
    params = [lastName, middleInitial, firstName, birthdate]

    if params.count(None) == 4:
        query = "SELECT id, lastName, middleInitial, firstName, birthdate FROM Users"

    else:
        query = "SELECT id, lastName, middleInitial, firstName, birthdate FROM Users WHERE "
        query_params = []

        if lastName is not None:
            lastNameParam = "lastName RLIKE \'{}\'".format(lastName)
            query_params.append(lastNameParam)

        if firstName is not None:
            firstNameParam = "firstName RLIKE \'{}\'".format(firstName)
            query_params.append(firstNameParam)

        if middleInitial is not None:
            middleInitialParam = "middleInitial RLIKE \'{}\'".format(middleInitial)
            query_params.append(middleInitialParam)

        if birthdate is not None:
            birthdateParam = "birthdate RLIKE \'{}\'".format(birthdate)
            query_params.append(birthdateParam)

        query_addition = ' AND '.join(query_params)
        query += query_addition

    cnx, cursor = instantiate_connection()
    cursor.execute(query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    close_connection(cursor, cnx)

    return [[id, lastname, middleinit, firstname, birthdate] for id, lastname, middleinit, firstname, birthdate, in cursor], 200


def get_user_info_get(userID) -> str:
    if not valid_user_id(userID):
        return "Invalid userID", 400

    query = "SELECT lastName, middleInitial, firstName, birthdate FROM Users WHERE id={}".format(userID)

    cnx, cursor = instantiate_connection()
    cursor.execute(query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    row = cursor.fetchone()
    lastname, middleinit, firstname, birthdate, = row
    close_connection(cursor, cnx)

    return [lastname, middleinit, firstname, birthdate], 200


def update_user_put(userID, lastName = None, middleInitial = None, firstName = None, birthdate = None) -> str:
    params = [lastName, middleInitial, firstName, birthdate]
    if params.count(None) == 4:
        return 'Bad Request: Please include at least one parameter to update', 400

    if not valid_text_params([lastName, middleInitial, firstName]):
        return "Invalid parameters, numbers or symbols cannot be contained in name fields", 400

    if not valid_date_params([birthdate]):
        return "Invalid birthdate", 400

    user_query = "SELECT * FROM Users WHERE id={}".format(userID)
    cnx, cursor = instantiate_connection()
    cursor.execute(user_query)

    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User does not exist', 404

    query = "UPDATE Users SET "
    query_params = []

    if lastName is not None:
        lastNameParam = "lastName=\"{}\"".format(lastName)
        query_params.append(lastNameParam)

    if middleInitial is not None:
        middleInitialParam = "middleInitial=\"{}\"".format(middleInitial)
        query_params.append(middleInitialParam)

    if firstName is not None:
        firstNameParam = "firstName=\"{}\"".format(firstName)
        query_params.append(firstNameParam)

    if birthdate is not None:
        birthdateParam = "birthdate=\"{}\"".format(birthdate)
        query_params.append(birthdateParam)

    query_addition = ', '.join(query_params)
    query += query_addition
    query += " WHERE id = {}".format(userID)

    cursor.execute(query)
    cursor.fetchone()

    cnx.commit()
    close_connection(cursor, cnx)

    return 'Success: User updated!', 201