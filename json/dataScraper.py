import re
import sys


filename='test.txt'

text = '' #string to hold all text from file

newState = '\"name\":\"\w*\s*\w*\"'
bracket = '}}'

num = '\-*\d\d\d*.\d\d\d\d\d\d' #regex to find all numbers
                                #numbers have same decimal format


#intialize collections for numbers and center points
stateData = []
centerLong = []
centerLat = []


with open(filename) as f:
    for line in f:
        text+=line #store every line in file in text

nums = re.compile(num)
result = ''

stateData = text.split('}}') #split full text into blocks by state

for state in stateData:
    #intialize vars to hold Longitudes and Latitudes
    bigLat = 0
    smallLat = 500
    bigLong = 0
    smallLong = -500


    result = nums.findall(state) #use regex to find all numbers
    for num in result:
        num = float(num) #convert to float to do comparisons

        #find outside longs/lats for each state
        if num < 0:
            if num < bigLong:
                bigLong = num 
                
        if num > 0:
            if num > bigLat:
                bigLat = num
    
        if num < 0 and num > bigLong:
            if num > smallLong:            
                smallLong = num
                
        if num > 0 and num < bigLat:
            if num < smallLat:
                smallLat = num

    #use newly found values and take the average to find the mid point
    #and add them to their respective collections
    centerLong.append((bigLong+smallLong)/2) 
    centerLat.append((bigLat+smallLat)/2)


#delete unnecessary numbers left from inital vars
centerLong.remove(-250.0)
centerLat.remove(250.0)


f2 = open('Scrape.txt', 'w') #open a new file to write to

f2.write('Longitude\'s : \n')
number = 1 # use this counter to number the data
for num in centerLong:
    
    f2.write(str(number) + '. ' + str(num)+ "\n")
    number+=1
    
f2.write('\n') #sepatate long and lat

f2.write('Latitude\'s : \n')
number = 1 # use this counter to number the data
for num in centerLat:
    f2.write(str(number) + '. ' + str(num)+ "\n")
    number+=1

f2.close() #make sure to close file reader/writer
