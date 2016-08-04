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
 *  the Free Software Foundation, either version 3 of the License, orre
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
int cont = 0;

void readPulsioximeter();

void setup() { 

	eHealth.initPulsioximeter();
	//Attach the inttruptions for using the pulsioximeter.
	attachInterrupt(6, readPulsioximeter, RISING);
    
}

void readPulsioximeter(){  

  cont ++;
  
  if (cont == 50) { //Get only of one 50 measures to reduce the latency
    eHealth.readPulsioximeter();  
    cont = 0;
  }
}
int get_BPM() {
	int BPM = 0;
	for(int i = 0; i < 25;i++)
	{
		BPM = eHealth.getBPM();
	
	}
	return BPM;
	
}

int get_OxygenSaturation() {
	int OxygenSaturation = 0;
	for(int i = 0; i < 25;i++)
	{
		OxygenSaturation = eHealth.getOxygenSaturation();
	
	}
	return OxygenSaturation;
	
}

/* This section of code will allow for a creation of a .so file which is a 
* binary file that can then be wrapped by ctypes so that these functions can be used 
* in python application or code bases. Please refer to readme for compiling instructions.
*/
extern "C" {
	void Setup(){
			setup();
		    }

	int getBPM(){	int bpm = 0;
			bpm = get_BPM();
			return bpm;
		    }
	int getOxygenSaturation()
		    {
			int OxygenSaturation = 0;
			OxygenSaturation = get_OxygenSaturation();
			return OxygenSaturation;
		    }
}

