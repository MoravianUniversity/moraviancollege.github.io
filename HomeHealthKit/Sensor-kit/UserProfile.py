import Sensor_Controls
import requestMethods as rm

from Sensors_Library import BloodPressure as bp

class UserProfile:

    # Initializes name and id
    # Adds hardcoded guest users to database (temporary)
    def __init__(self):
        self.name = ''
        self.id = 0



    #Gets the latest data points from the machine, stores it, adds it to the database and returns it to main.py
    def runTest(self):
        results = Sensor_Controls.getBloodPressureData(bp.getLength()-1)
        date = str(results.get('DateTime'))
        systolic = results.get('Systolic')
        diastolic = results.get('Diastolic')
        pulse = results.get('Pulse')
        rm.addUser(str(self.id) + ' U Guest ' + date + ' Guest' + str(self.id))
        dataPoints = [date, diastolic, systolic, pulse]
        rm.addBloodPressureData(self.id, dataPoints)
        return dataPoints

    def printInfo(self):
        print(self.name, self.id)

    def setInfo(self, text):
        self.name = str(text)

        if self.name == 'Guest 1':
            self.id = 1
        elif self.name == 'Guest 2':
            self.id = 2
        elif self.name == 'Guest 3':
            self.id = 3
        elif self.name == 'Guest 4':
            self.id = 4
