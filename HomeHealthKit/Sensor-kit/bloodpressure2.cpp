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

void setup() {
		eHealth.readBloodPressureSensor();    
	     }

int Number_of_Entries() {	
		           int length = 0;
		  	   length = eHealth.getBloodPressureLength(); 
  			   return length;
			}

int day(int index){	
		int day = 0;	  
		day = eHealth.bloodPressureDataVector[index].day;
		return day;
	}     
int month(int index){
		int month = 0;
		month = eHealth.bloodPressureDataVector[index].month;
		return month;
	   }    
int year(int index){
		int year = 0;
		year = 2000 + eHealth.bloodPressureDataVector[index].year;
		return year;
	  }
int hour(int index){    
			int hour = 0;	
			hour = eHealth.bloodPressureDataVector[index].hour;
		    	return hour;
		   }
int minutes(int index){
		    	int minute = 0;
			minute=eHealth.bloodPressureDataVector[index].minutes;
			return minute;
		      }
int systolic(int index){
		   	int systolic = 0;
			systolic = 30+eHealth.bloodPressureDataVector[index].systolic;
		    	return systolic;
		       }
int diastolic(int index){
		          int diastolic = 0;
		          diastolic = eHealth.bloodPressureDataVector[index].diastolic;
		          return diastolic;
			}
int pulse(int index){
		    	int pulse = 0;
		    	pulse = eHealth.bloodPressureDataVector[index].pulse;
		    	return pulse;
		    }	
		    	
/* This section of code will allow for a creation of a .so file which is a 
* binary file that can then be wrapped by ctypes so that these functions can be used 
* in python application or code bases. Please refer to readme for compiling instructions.
*/ 
extern "C" {
	void Setup(){
			setup();
		    }
			
	int getLength(){
				int entries = 0;
				entries = Number_of_Entries();
				return entries;
	   }
	int getDay(int index){
				int days = 0;
				days = day(index);
				return days;
			 }
	int getYear(int index){
				int years = 0;
				years = year(index);
				return years;
			  }
	int getMonth(int index){
				int months = 0;
				months = month(index);
				return months;
			   }
	int getHour(int index){
				int hours = 0;
				hours = hour(index);
				return hours;
			  }
	int getMinute(int index){
				int minute = 0;
				minute = minutes(index);
				return minute;
			    }
	int getSystolic(int index){
				int systolics = 0;
				systolics = systolic(index);
				return systolics;
			     }
	int getDiatolic(int index){
				int diastolics = 0;
				diastolics = diastolic(index);
				return diastolics;
			     }
     int getPulse(int index){
				int pulses = 0;
				pulses = pulse(index);
				return pulses;
			}
}