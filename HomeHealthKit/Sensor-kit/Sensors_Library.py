from ctypes import *
Galvanic = cdll.LoadLibrary('./libgalvanic.so')
Galvanic.getSkinConductanceVoltage.restype = c_float
Galvanic.getConductance.restype = c_float
Galvanic.getSkinResistance.restype = c_float

from ctypes import cdll
BloodPressure = cdll.LoadLibrary('./libbloodpressure2.so')

from ctypes import cdll
Pulsioximeter = cdll.LoadLibrary('./libpulsioximeter.so')
