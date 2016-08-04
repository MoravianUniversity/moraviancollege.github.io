import requests
from unittest import TestCase

api_url = 'http://127.0.0.1:8080/'


class TestGetUserInfo(TestCase):
    method_url = api_url + 'getUserInfo'

    def test_success(self):
        r = requests.get(TestGetUserInfo.method_url, params = {'userID' : '1'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0] == "Vanilla"
        assert rtext[1] == "P"
        assert rtext[2] == "Jan"
        assert rtext[3] == "1996-03-30"

    def test_bad_parameters(self):
        param_array = [{'userID': 'a'}, {'userID': 'A'}, {'userID': '&'}]

        for p in param_array:
            r = requests.get(TestGetUserInfo.method_url, params = p)
            assert r.status_code == 400

    def test_no_params(self):
        r = requests.get(TestGetUserInfo.method_url)

        assert r.status_code == 400


class TestUpdateUser(TestCase):
    method_url = api_url + 'updateUser'

    def return_results(self, parameters):
        return requests.put(TestUpdateUser.method_url, params = parameters)

    def test_no_update_parameters(self):
        p = {}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 400

    def test_only_userID(self):
        p = {'userID': '1'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 400

    def test_user_does_not_exist(self):
        p = {'userID': '10'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 400

    def test_bad_characters_text_fields(self):
        for key in ['lastName', 'middleInitial', 'firstName']:
            p = {'userID': '1', key: '!'}
            r = TestUpdateUser.return_results(self, p)

            assert r.status_code == 400

    def test_bad_dates(self):
        for value in ['1990-17-01', '1990-01-32']:
            p = {'userID': '1', 'birthdate': value}
            r = TestUpdateUser.return_results(self, p)

            assert r.status_code == 400

    def test_one_parameter_success(self):
        p = {'userID' : '1', 'lastName' : 'Smith'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 201

    def test_two_parameter_success(self):
        p = {'userID' : '1', 'lastName' : 'Smith', 'middleInitial' : 'Q'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 201

    def test_three_parameter_success(self):
        p = {'userID': '1', 'lastName': 'Smith', 'middleInitial': 'Q',
             'firstName': 'John'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 201

    def test_all_parameter_success(self):
        p = {'userID': '1', 'lastName': 'Smith', 'middleInitial': 'Q',
             'firstName': 'John', 'birthdate': '1990-01-02'}
        r = TestUpdateUser.return_results(self, p)

        assert r.status_code == 201


class TestGetUserIndex(TestCase):
    method_url = api_url + 'getUserIndex'

    def test_success_no_params(self):
        r = requests.get(TestGetUserIndex.method_url)

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][1] == "Vanilla"
        assert rtext[0][2] == "P"
        assert rtext[0][3] == "Jan"
        assert rtext[0][4] == "1996-03-30"

        assert rtext[1][1] == "Zambeezy"
        assert rtext[1][2] == "N"
        assert rtext[1][3] == "Nicc"
        assert rtext[1][4] == "1990-02-01"

        assert rtext[2][1] == "Lameoureuxxx"
        assert rtext[2][2] == "L"
        assert rtext[2][3] == "Ahna"
        assert rtext[2][4] == "1992-09-02"

        assert rtext[3][1] == "Russell"
        assert rtext[3][2] == "K"
        assert rtext[3][3] == "Jish"
        assert rtext[3][4] == "1994-06-05"

        assert len(rtext) == 4

    def test_success_lastName(self):
        r = requests.get(TestGetUserIndex.method_url, params = {'lastName': 'Zamb'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][1] == "Zambeezy"
        assert rtext[0][2] == "N"
        assert rtext[0][3] == "Nicc"
        assert rtext[0][4] == "1990-02-01"

        assert len(rtext) == 1

    def test_success_firstName(self):
        r = requests.get(TestGetUserIndex.method_url, params = {'firstName': 'Ahn'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][1] == "Lameoureuxxx"
        assert rtext[0][2] == "L"
        assert rtext[0][3] == "Ahna"
        assert rtext[0][4] == "1992-09-02"

        assert len(rtext) == 1

    def test_success_middleInitial(self):
        r = requests.get(TestGetUserIndex.method_url, params = {'middleInitial': 'P'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][1] == "Vanilla"
        assert rtext[0][2] == "P"
        assert rtext[0][3] == "Jan"
        assert rtext[0][4] == "1996-03-30"

        assert len(rtext) == 1

    def test_success_birthdate(self):
        r = requests.get(TestGetUserIndex.method_url, params = {'birthdate': '1990'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][1] == "Zambeezy"
        assert rtext[0][2] == "N"
        assert rtext[0][3] == "Nicc"
        assert rtext[0][4] == "1990-02-01"

        assert len(rtext) == 1


class TestGetBloodPressure(TestCase):
    method_url = api_url + 'getBloodPressure'

    def test_success_no_time(self):
        r = requests.get(TestGetBloodPressure.method_url, params={'userID': '1'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-20T02:00:00Z"
        assert rtext[0][1] == 70
        assert rtext[0][2] == 110
        assert rtext[0][3] == 55

        assert len(rtext) == 3

    def test_success_startTime_all(self):
        r = requests.get(TestGetBloodPressure.method_url, params={'userID': '1', 'startTime': '2016-07-20T01:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-20T02:00:00Z"
        assert rtext[0][1] == 70
        assert rtext[0][2] == 110
        assert rtext[0][3] == 55

        assert rtext[1][0] == "2016-07-21T03:00:00Z"
        assert rtext[1][1] == 80
        assert rtext[1][2] == 120
        assert rtext[1][3] == 65

        assert rtext[2][0] == "2016-07-22T04:00:00Z"
        assert rtext[2][1] == 90
        assert rtext[2][2] == 130
        assert rtext[2][3] == 75

        assert len(rtext) == 3

    def test_success_startTime_skip(self):
        r = requests.get(TestGetBloodPressure.method_url, params={'userID': '1', 'startTime': '2016-07-21T01:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-21T03:00:00Z"
        assert rtext[0][1] == 80
        assert rtext[0][2] == 120
        assert rtext[0][3] == 65

        assert rtext[1][0] == "2016-07-22T04:00:00Z"
        assert rtext[1][1] == 90
        assert rtext[1][2] == 130
        assert rtext[1][3] == 75

        assert len(rtext) == 2

    def test_success_endTime_all(self):
        r = requests.get(TestGetBloodPressure.method_url, params={'userID': '1', 'endTime': '2017-01-01T01:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-20T02:00:00Z"

        assert rtext[1][0] == "2016-07-21T03:00:00Z"

        assert rtext[2][0] == "2016-07-22T04:00:00Z"

        assert len(rtext) == 3

    def test_success_endTime_skip(self):
        r = requests.get(TestGetBloodPressure.method_url, params={'userID': '1', 'endTime': '2016-07-21T23:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-20T02:00:00Z"

        assert rtext[1][0] == "2016-07-21T03:00:00Z"

        assert len(rtext) == 2

    def test_null_user(self):
        param_array = [{'userID': '10'}, {'userID': '10', 'startTime': '2016-01-01T01:00:00Z'},
                       {'userID': '10', 'endTime': '2016-01-01T01:00:00Z'}]

        for p in param_array:
            r = requests.get(TestGetBloodPressure.method_url, params=p)
            assert r.status_code == 404

    def test_bad_params(self):
        param_array = [{'userID': 'a'}, {'userID': '1', 'startTime': 'alphabetsoup'},
                       {'userID': '1', 'endTime': 'doubleflip'}]

        for p in param_array:
            r = requests.get(TestGetBloodPressure.method_url, params=p)
            assert r.status_code == 400


class TestGetRecoveryTest(TestCase):
    method_url = api_url + 'getRecoveryTest'

    def test_success_no_time(self):
        r = requests.get(TestGetRecoveryTest.method_url, params={'userID': '1'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-19T01:00:00Z"
        assert rtext[0][1] == 150

        assert rtext[1][0] == "2016-07-19T01:01:00Z"
        assert rtext[1][1] == 140

        assert rtext[2][0] == "2016-07-19T01:02:00Z"

        assert rtext[3][1] == 130

        assert rtext[12][0] == "2016-07-21T12:05:00Z"
        assert rtext[12][1] == 70

        assert len(rtext) == 13

    def test_success_startTime_all(self):
        r = requests.get(TestGetRecoveryTest.method_url, params={'userID': '1', 'startTime': '2016-01-01T01:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-19T01:00:00Z"
        assert rtext[0][1] == 150

        assert rtext[1][0] == "2016-07-19T01:01:00Z"
        assert rtext[1][1] == 140

        assert rtext[2][0] == "2016-07-19T01:02:00Z"

        assert rtext[3][1] == 130

        assert rtext[12][0] == "2016-07-21T12:05:00Z"
        assert rtext[12][1] == 70

        assert len(rtext) == 13

    def test_success_startTime_skip(self):
        r = requests.get(TestGetRecoveryTest.method_url, params={'userID' : '1', 'startTime': '2016-07-20T23:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-21T12:00:00Z"
        assert rtext[0][1] == 170

        assert rtext[1][0] == "2016-07-21T12:01:00Z"
        assert rtext[1][1] == 150

        assert rtext[5][0] == "2016-07-21T12:05:00Z"
        assert rtext[5][1] == 70

        assert len(rtext) == 6

    def test_success_endTime_all(self):
        r = requests.get(TestGetRecoveryTest.method_url, params={'userID': '1', 'endTime': '2016-07-21T23:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-19T01:00:00Z"
        assert rtext[0][1] == 150

        assert rtext[1][0] == "2016-07-19T01:01:00Z"
        assert rtext[1][1] == 140

        assert rtext[2][0] == "2016-07-19T01:02:00Z"

        assert rtext[3][1] == 130

        assert rtext[12][0] == "2016-07-21T12:05:00Z"
        assert rtext[12][1] == 70

        assert len(rtext) == 13

    def test_success_endTime_skip(self):
        r = requests.get(TestGetRecoveryTest.method_url, params={'userID': '1', 'endTime': '2016-07-19T23:00:00Z'})

        assert r.status_code == 200

        rtext = r.json()

        assert rtext[0][0] == "2016-07-19T01:00:00Z"
        assert rtext[0][1] == 150

        assert len(rtext) == 3

    def test_user_null(self):
        param_array = [{'userID': '10'}, {'userID': '10', 'startTime': '2016-01-01T01:00:00Z'},
                       {'userID': '10', 'endTime': '2017-01-01T01:00:00Z'},
                       {'userID': '10', 'startTime': '2016-01-01T01:00:00Z', 'endTime': '2017-01-01T01:00:00Z'}]

        for p in param_array:
            r = requests.get(TestGetRecoveryTest.method_url, params=p)
            assert r.status_code == 404

    def test_bad_params(self):
        param_array = [{'userID': 'a'}, {'userID': '1', 'startTime': 'applebees'}, {'userID': '1', 'endTime': 'bonanza'},
                       {'userID': '1', 'startTime': 'apple', 'endTime': 'banana'},
                       {'userID': 'w', 'startTime': 'now', 'endTime': 'then'}]

        for p in param_array:
            r = requests.get(TestGetRecoveryTest.method_url, params=p)
            assert r.status_code == 400


class TestAddBloodPressure(TestCase):
    method_url = api_url + 'addBloodPressure'
    headers = {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json;charset=UTF-8'}
    payload = '["2016-01-01 01:00:00", "100", "100", "100"]'

    def test_success(self):
        r = requests.post(TestAddBloodPressure.method_url,
                        params={'userID': '1'}, data=self.payload, headers=self.headers)

        assert r.status_code == 201

    def test_bad_params(self):
        param_array = [{'userId': '1',}, {'userID': '0'}, {'userID': 'aa'}]
        payload_array = ['["2016-01-01 01:00:00", "aa", "100", "bb"]', '["1000-05-05 02:00:00", "aa", "100", "100"]',
                         '["applesauce", "80", "80", "80"]']

        for p in param_array:
            for d in payload_array:
                r = requests.post(TestAddBloodPressure.method_url, params=p, data=d, headers=self.headers)
                assert r.status_code == 400


class TestAddElectricalResistanceTest(TestCase):
    method_url = api_url + 'addElectricalResistanceTest'
    headers = {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json;charset=UTF-8'}
    payload = '["2016-07-01 01:00:00", "01", "01", "01"]'

    def test_success(self):
        r = requests.post(TestAddElectricalResistanceTest.method_url,
                          params={'userID': '1'}, data=self.payload, headers=self.headers)

        assert r.status_code == 201

    def test_bad_params(self):
        param_array = [{'userID': 'pie'}, {'userID': '0'}]
        payload_array = ['["applesauce", "a", "a", "1.0"]', '["2016-07-01 01:00:00, "1.0", "aa", "1.1"]']

        for p in param_array:
            for d in payload_array:
                r = requests.post(TestAddElectricalResistanceTest.method_url, params=p, data=d, headers=self.headers)
                assert r.status_code == 400


class TestAddRecoveryTest(TestCase):
    method_url = api_url + 'addRecoveryTest'
    headers = {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json;charset=UTF-8'}
    payload = '[["2016-07-01 01:00:00", "60"], ["2016-07-01 01:00:10", "59"], ["2016-07-01 01:00:20", "58"]]'

    def test_success(self):
        r = requests.post(TestAddRecoveryTest.method_url, params={'userID': '1'}, data=self.payload, headers=self.headers)

        assert r.status_code == 201

    def test_bad_params(self):
        param_array = [{'userID': 'pie'}, {'userID': '1'}]
        payload_array = ['[["Today", "00"], ["2016-07-01 01:00:10", "at"], ["2016-07-01 01:00:20", "60"]]',
                         '[["2016-01-01 01:00:00", "10"], ["Yesterday", "apple"], ["2016-02-02 02:00:00", "aa"]]']

        for p in param_array:
            for d in payload_array:
                r = requests.post(TestAddRecoveryTest.method_url, params=p, data=d, headers=self.headers)
                assert r.status_code == 400