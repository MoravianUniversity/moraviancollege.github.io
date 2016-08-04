

/*
 *  eHealth sensor platform for Arduino and Raspberry from Cooking-hacks.
 *
 *  Description: "The e-Health Sensor Shield allows Arduino and Raspberry Pi 
 *  users to perform biometric and medical applications by using 9 different 
 *  sensors: Pulse and Oxygen in Blood Sensor (SPO2), Airflow Sensor (Breathing),
 *  Body Temperature, Electrocardiogram Sensor (ECG), Glucometer, Galvanic Skin
 *  Response Sensor (GSR - Sweating), Blood Pressure (Sphygmomanometer) and 
 *  Patient Position (Accelerometer)."
 *
 *  In this example we read the values in volts of EMG sensor and show
 *  these values in the serial monitor. 
 *
 *  Copyright (C) 2012 Libelium Comunicaciones Distribuidas S.L.
 *  http://www.libelium.com
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  Version 2.0
 *  Author: Luis Martin & Ahmad Saad & Anartz Nuin
 */

//Include eHealth library
#include "eHealth.h"

float getconductance() 
	{ 
		float conductance = eHealth.getSkinConductance();
		return conductance;
  	}
	

float getresistance() 
	{ 
		float resistance = eHealth.getSkinResistance();
		return resistance;
  	}

float getconductanceVol()
	{
  		float conductanceVol = eHealth.getSkinConductanceVoltage();
		return conductanceVol;
	}
	
/* This section of code will allow for a creation of a .so file which is a 
* binary file that can then be wrapped by ctypes so that these functions can be used 
* in python application or code bases. Please refer to readme for compiling instructions.
*/
extern "C" {
	float getConductance()
		{
			float conductance = getconductance();
			return conductance;
		}
	float getSkinResistance()
		{
			float resistance = getresistance();
			return resistance;
		}
	float getSkinConductanceVoltage()
		{
			float conductanceVol = getconductanceVol();
			return conductanceVol;
		}
}


