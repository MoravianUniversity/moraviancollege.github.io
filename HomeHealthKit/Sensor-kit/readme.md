The e-Health Sensor Platform requires several more files for customizing the app. 
These files are available from 
https://www.cooking-hacks.com/documentation/tutorials/ehealth-biometric-sensor-platform-arduino-raspberry-pi-medical. 
The libraries can be found in the third section of the Article Index on the page and 
has libraries for either Arduino or Raspberry Pi.

Currently only three .cpp files have been customized to allow for compatibility with our sensor platform. 
These include the blood pressure, galvanic, and pulsioximeter sensor cpp files. 
All others must have an added extern c function, have a .so file created, and be included in Sensors_Library.py.

To create a .so file for you .cpp file simply run the commands:
first create a .o file for your cpp file by using the command
	g++ -c -fPIC name_of_cpp_file.cpp -o name_you_want_for_o_file.o

Second command:
	g++ -shared -Wl,-soname,lib_name_you_wish_to_use.so -o libname_you_wish_to_use.so 	name_of_o_file_created_above.o eHealth.o arduPi.o

For additional information please contact Michael Turnbach at stmpt03@moravian.edu or Andrew Reed at stabr02@moravian.edu
