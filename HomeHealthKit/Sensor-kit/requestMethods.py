# See Gabe for any questions.

import requests
api_url = 'http://pegasus.cs.moravian.edu:8080/'

user_record = {}


def fix_user_id(user_id):
    if not isinstance(user_id, int):
        user_id = user_record['{}'.format(user_id)]['userID']
        return user_id
    else:
        return user_id


def addUser(string):
    # userInfo is created from a string input on the CreateNewUserScreen screen. The string MUST be formatted correctly:
    # "{lastName} {middleInitial} {firstName} {birthdate} {username}" The format of each item must also match the API specs.
    # If the input method could be changed to a form-like page, it would work better, and would also need to be changed.

    userInfo = string.strip().split(" ")
    method_url = api_url + 'addUser'

    lastName = userInfo[0]
    middleInitial = userInfo[1]
    firstName = userInfo[2]
    birthdate = userInfo[3]

    username = userInfo[4]

    r = requests.post(method_url, params={'lastName': '{}'.format(lastName),
                                            'middleInitial': '{}'.format(middleInitial),
                                            'firstName': '{}'.format(firstName),
                                            'birthdate': '{}'.format(birthdate)})

    if r.status_code == 200 or r.status_code == 201:
        # If the request gets a 'good' status code a dictionary corresponding to the user's information is added to
        # a dictionary of users called user_record, each identified by a username.
        # The dictionary of user information includes a last-name, middle-initial, first-name, birthdate,
        # and user_id which serves as the user's unique identifier within the database.
        user_record['{}'.format(username)] = r.json()
        return r.json()
    else:
        return r.json()


# Returns an array of blood-pressure data arrays. (e.g. [['<timestamp>', <diastolic>, <systolic>, <pulse>]...]  )
def getBloodPressureData(user_id, startTime=None, endTime=None):
    method_url = api_url + 'getBloodPressure'
    user_id = fix_user_id(user_id)

    parameters = {'userID': '{}'.format(user_id)}

    if startTime is not None:
        parameters['startTime'] = '{}'.format(startTime)
    if endTime is not None:
        parameters['endTime'] = '{}'.format(endTime)

    r = requests.get(method_url, params=parameters)
    data = r.json()

    if r.status_code == 200:
        return data
    elif r.status_code == 400:
        return data
    else:
        return data


# Send blood-pressure data to the database bloodPressureData should be formatted correctly:
#                                                                      ["<timestamp>", <diastolic>, <systolic>, <pulse>]
def addBloodPressureData(user_id, bloodPressureData):
    method_url = api_url + 'addBloodPressure'
    header = {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json;charset=UTF-8'}
    user_id = fix_user_id(user_id)

    #payload =[]
    #for i in bloodPressureData:
    #    payload.append(str(i))

    #payload=bloodPressureData

    payload = '[\"{}\", \"{}\", \"{}\", \"{}\"]'.format(bloodPressureData[0], bloodPressureData[1], bloodPressureData[2], bloodPressureData[3])   
    parameters = {'userID': '{}'.format(user_id)}

    r = requests.post(method_url, params=parameters, data=payload, headers=header)
    data = r.json()

    if r.status_code == 200 or r.status_code == 201:
        return data
    elif r.status_code == 400:
        return data
    elif r.status_code == 404:
        return data


# FOR ALL user_id INPUTS: user_id may either be the username in user_records, or their unique userID from our database.
# Returns an array of user information given a user_id: ['<lastName>', '<middleInitial>', '<firstName>', '<birthdate>']
def getUserInfo(user_id):
    method_url = api_url + 'getUserInfo'
    user_id = fix_user_id(user_id)

    r = requests.get(method_url, params={'userID': '{}'.format(user_id)})
    data = r.json()

    if r.status_code == 200:
        return data
    elif r.status_code == 400:
        return data
    elif r.status_code == 404:
        return data
    else:
        return data


# Updates a user's information in the database. Each parameter is optional.
# However, if no parameters are passed the update will fail.
def updateUserInfo(user_id, lastName=None, middleInitial=None, firstName=None, birthdate=None):
    method_url = api_url + 'updateUser'
    user_id = fix_user_id(user_id)
    parameters = {'userID': '{}'.format(user_id)}

    if lastName is not None:
        parameters['lastName'] = '{}'.format(lastName)
    if firstName is not None:
        parameters['firstName'] = '{}'.format(firstName)
    if middleInitial is not None:
        parameters['middleInitial'] = '{}'.format(middleInitial)
    if birthdate is not None:
        parameters['birthdate'] = '{}'.format(birthdate)

    r = requests.put(method_url, params=parameters)
    data = r.json()

    if r.status_code == 200 or r.status_code == 201:
        return data
    elif r.status_code == 400:
        return data
    elif r.status_code == 404:
        return data
    else:
        return data
