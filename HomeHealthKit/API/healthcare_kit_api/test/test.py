import requests

api_url = 'http://127.0.0.1:8080/'

# def start_api():
#     child = subprocess.call(["python", '../app.py'])
#
#     #child = multiprocessing.Process(target=start())
#
#     return child
#
# def stop_api(api_process):
#     #api_process.wait()
#     api_process.terminate()

method_url = api_url + 'getUserInfo'

r = requests.get(method_url, params = {'userID' : '1'})

assert r.status_code == 200
print(r.json())
