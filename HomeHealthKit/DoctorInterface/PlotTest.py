import kivy
import requests
import datetime

from kivy.app import App
from kivy.lang import Builder
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.boxlayout import BoxLayout
from kivy.properties import StringProperty
from kivy.garden.graph import Graph, LinePlot
from kivy.uix.spinner import Spinner

from random import randint

#Patient object stores patient information
class Patient:
	def __init__(self, name):
		self.timeStamps = []
		self.diastolics = []
		self.systolics = []
		self.bpms = []
		self.name = name

	def add_entry(self, timestamp, diastolic, systolic, bpm):
		self.timeStamps.append(timestamp)
		self.diastolics.append(diastolic)
		self.systolics.append(systolic)
		self.bpms.append(bpm)

	def get_timeStamp(self, index):
		return self.timeStamps[index]

	def get_diastolic(self, index):
		return self.diastolics[index]

	def get_systolic(self, index):
		return self.systolics[index]

	def get_bpm(self, index):
		return self.bpms[index]

	def get_name(self):
		return self.name

	def get_timeStampsLength(self):
		return len(self.timeStamps)

class PlotTest(FloatLayout):

	patient = StringProperty()

	def __init__(self, **kwargs):
		super(PlotTest, self).__init__(**kwargs)
		self.plot_hor = None
		self.plot_vert = None
		self.plot_dia = None
		self.plot_sys = None

	def call_api(self, id):
		url = 'http://pegasus.cs.moravian.edu:8080/'

		response1 = requests.get(url + 'getUserInfo', params = {'userID' : id})
		rtext = response1.json()

		patientName = rtext[2] + " " + rtext[1] + " " + rtext[0]

		response2 = requests.get(url + 'getBloodPressure', params = {'userID' : id})
		rtext = response2.json()

		patient1 = Patient(patientName)
		for num in range(len(rtext)):
			patient1.add_entry(datetime.datetime.now(), rtext[num][1], rtext[num][2], rtext[num][3])

		return patient1


	def change_points(self, graph):
		if self.plot_hor is not None and self.plot_vert is not None:
			graph.remove_plot(self.plot_hor)
			graph.remove_plot(self.plot_vert)

		x = 0
		y = 0

		if self.patient == 'Patient 1':
			patient1 = self.call_api('1')
			x = patient1.get_diastolic(patient1.get_timeStampsLength() - 1)
			y = patient1.get_systolic(patient1.get_timeStampsLength() - 1)
		elif self.patient == 'Patient 2':
			patient2 = self.call_api('2')
			x = patient2.get_diastolic(patient2.get_timeStampsLength() - 1)
			y = patient2.get_systolic(patient2.get_timeStampsLength() - 1)
		elif self.patient == 'Patient 3':
			patient3 = self.call_api('3')
			x = patient3.get_diastolic(patient3.get_timeStampsLength() - 1)
			y = patient3.get_systolic(patient3.get_timeStampsLength() - 1)
		elif self.patient == 'Patient 4':
			patient4 = self.call_api('4')
			x = patient4.get_diastolic(patient4.get_timeStampsLength() - 1)
			y = patient4.get_systolic(patient4.get_timeStampsLength() - 1)
		elif self.patient == 'Bob E Smith':
			patient5 = self.call_api('5')
			x = patient5.get_diastolic(patient5.get_timeStampsLength() - 1)
			y = patient5.get_systolic(patient5.get_timeStampsLength() - 1)
		else:
			patient6 = self.call_api('6')
			x = patient6.get_diastolic(patient6.get_timeStampsLength() - 1)
			y = patient6.get_systolic(patient6.get_timeStampsLength() - 1)

		p1 = (x, 0)
		p2 = (x, y)
		p3 = (0, y)

		self.plot_hor = LinePlot(color=[0, 0, 0, 1])
		self.plot_vert = LinePlot(color=[0, 0, 0, 1])
		self.plot_hor.points = [p1, p2]
		self.plot_vert.points = [p2, p3]

		graph.add_plot(self.plot_hor)
		graph.add_plot(self.plot_vert)

		print(self.patient, x, y)

	def change_points_over_time(self, graph):
		if self.plot_sys is not None and self.plot_dia is not None:
			graph.remove_plot(self.plot_dia)
			graph.remove_plot(self.plot_sys)

		dia_points = []
		sys_points = []

		if self.patient == 'Patient 1':
			patient1 = self.call_api('1')
			for x in range(patient1.get_timeStampsLength()):
				dia_points.append((x, patient1.get_diastolic(x)))
				sys_points.append((x, patient1.get_systolic(x)))

		elif self.patient == 'Patient 2':
			patient2 = self.call_api('2')
			for x in range(patient2.get_timeStampsLength()):
				dia_points.append((x, patient2.get_diastolic(x)))
				sys_points.append((x, patient2.get_systolic(x)))

		elif self.patient == 'Patient 3':
			patient3 = self.call_api('3')
			for x in range(patient3.get_timeStampsLength()):
				dia_points.append((x, patient3.get_diastolic(x)))
				sys_points.append((x, patient3.get_systolic(x)))

		elif self.patient == 'Patient 4':
			patient4 = self.call_api('4')
			for x in range(patient4.get_timeStampsLength()):
				dia_points.append((x, patient4.get_diastolic(x)))
				sys_points.append((x, patient4.get_systolic(x)))

		elif self.patient == 'Bob E Smith':
			patient5 = self.call_api('5')
			for x in range(patient5.get_timeStampsLength()):
				dia_points.append((x, patient5.get_diastolic(x)))
				sys_points.append((x, patient5.get_systolic(x)))
		else:
			patient6 = self.call_api('6')
			for x in range(patient6.get_timeStampsLength()):
				dia_points.append((x, patient6.get_diastolic(x)))
				sys_points.append((x, patient6.get_systolic(x)))

		self.plot_dia = LinePlot(color=[1, 0, 0, 1])
		self.plot_sys = LinePlot(color=[1, 0, 0, 1])

		self.plot_dia.points = dia_points
		self.plot_sys.points = sys_points

		graph.add_plot(self.plot_dia)
		graph.add_plot(self.plot_sys)

class PlotTestApp(App):
	def build(self):
		return PlotTest()

if __name__ == '__main__':
	PlotTestApp().run()
