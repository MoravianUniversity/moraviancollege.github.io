import numpy as np
from Sensors_Library import Galvanic, BloodPressure, Pulsioximeter
import time
import datetime

def getGalvanicData():
	Conductance = Galvanic.getConductance()
	Resistance = Galvanic.getSkinResistance()
	Voltage = Galvanic.getSkinConductanceVoltage()
	Quality_Check_Galvanic(Resistance,Conductance,Voltage)
    	return {"Conductance": Conductance, "Resistance": Resistance, "Voltage": Voltage}

def Quality_Check_Galvanic(Resistance,Conductance,Voltage):
    if Resistance == -1.0 and Conductance == -1.0 and Voltage < .464:
        raise ValueError("make sure the sensor is plugged in fully")
    if Resistance == -1.0 and Conductance == -1.0:
        raise ValueError("Please make sure both fingers are attached to sensor")
 

def getPulsioximeterData():	
    bpm = []
    oxySaturation = []
    Pulsioximeter.Setup()
    for loop in range(60):
        Oximeter_read(bpm,oxySaturation)
        time.sleep(1)
    finalBPM, finalOxygen = Quality_Check_Oximeter(bpm,oxySaturation)
    if finalBPM == 0 and finalOxygen == 0:
	raise ValueError("Please make sure your finger is in the sensor \ if your finger is in the senor ensure the sensor ist attached correctly") 
    return {"BPM": finalBPM, "Oxygen": finalOxygen}
   
def Oximeter_read(bpm,oxySaturation):
    BPM = Pulsioximeter.getBPM()
    Oxygen = Pulsioximeter.getOxygenSaturation()
    if BPM > 20 and Oxygen > 10:
        bpm.append(BPM)
        oxySaturation.append(Oxygen)
            
def Quality_Check_Oximeter(bpm,oxySaturation):
    bpm.sort()
    oxySaturation.sort()
    accurate_bpm = np.median(bpm)
    accurate_oxygen = np.median(oxySaturation)
    return int(accurate_bpm), int(accurate_oxygen)
    
def getBloodPressureData(index):
        BloodPressure.Setup() 
        return {"Systolic": BloodPressure.getSystolic(index),
                "Diastolic": BloodPressure.getDiatolic(index),
                "Pulse": BloodPressure.getPulse(index),
                "DateTime": getBPDateTime(index)}

def getBPDateTime(index):
        year = BloodPressure.getYear(index)
        print(year)
        month = BloodPressure.getMonth(index)
        print(month)
        day = BloodPressure.getDay(index)
        print(day)
        hour = BloodPressure.getHour(index)
        minute = BloodPressure.getMinute(index)

        date = str(datetime.datetime(year, month,
                        day, hour,
                        minute))
        
        print(date)
        return date
