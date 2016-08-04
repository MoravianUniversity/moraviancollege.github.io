from UserProfile import *

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import NumericProperty, StringProperty
from random import randint
from Sensors_Library import BloodPressure as bp
 

user = UserProfile()
bp.Setup()

class Sensor(BoxLayout):

    systolic = NumericProperty(0.0)
    diastolic = NumericProperty(0.0)
    pulse = NumericProperty(0.0)
    user = StringProperty('')

    def __init__(self, **kwargs):
        super(Sensor, self).__init__(**kwargs)

    def runBP(self):
    	user.setInfo(self.user)
    	results = user.runTest()
        self.systolic = results[2]
        self.diastolic = results[1]
        self.pulse = results[3]
       # self.systolic = randint(110, 180)
       #self.diastolic = self.systolic - randint(35, 45)
       # self.pulse = randint(50, 90)

        print(self.user, self.systolic, self.diastolic, self.pulse)


class SensorApp(App):
    def build(self):
        return Sensor()


if __name__ == '__main__':
    SensorApp().run()
