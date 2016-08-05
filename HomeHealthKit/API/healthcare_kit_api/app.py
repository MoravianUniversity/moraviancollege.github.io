#!/usr/bin/env python3

import connexion

def start():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.add_api('swagger.yaml', arguments={'title': 'The Healthcare Kit API is intended to serve as an interface for communication between three seperate components; a medical sensor kit, a database, and an application. It provides a loose coupling between all three of these components such that future changes to any of these systems can be done as simply as possible. The Healthcare Kit API includes methods for adding users to a database, updating user information in the database, collecting user information, and pushing and pulling medical sensor data from the database. In order to keep the Healthcare API Kit flexible, it is designed to accomodate data from any type of medical test. However, the current version of the API (&#39;0.0.1&#39;) only supports three types of tests; blood pressure, pulse recovery, and electrical resistance.&#39; '})
    app.run(port=8080)


if __name__ == '__main__':
    start()

