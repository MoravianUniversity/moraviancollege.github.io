import mysql.connector as connector


def instantiate_connection():
    cnx = connector.connect(user='root', host='127.0.0.1', database='healthkitData')
    cursor = cnx.cursor()
    return cnx, cursor


def close_connection(cursor, cnx):
    cursor = None
    cnx.close()


# It is unclear whether we would like to return all recovery tests that have data-points within the time-frame,
# or whether we would like to only return specific data-points within the time-frame.
# This test method gets full test data when given a start or end time.
def get_recovery_test_getBYTEST(userID, startTime = None, endTime = None) -> str:
    dataID_query = "SELECT dataID FROM Recoveries WHERE userID={}".format(userID)
    if (startTime is not None) and (endTime is not None):
        dataID_query += " AND endTime >= \"{}\" AND startTime <= \"{}\"".format(startTime, endTime)

    elif (startTime is None) and (endTime is not None):
        dataID_query += " AND startTime <= \"{}\"".format(endTime)

    elif (startTime is not None) and (endTime is None):
        dataID_query += " AND endTime >= \"{}\"".format(startTime)

    cnx, cursor = instantiate_connection()

    cursor.execute(dataID_query)
    row_count = cursor.rowcount
    if row_count <= 0:
        close_connection(cursor, cnx)
        return 'Data Not Found: User data does not exist', 404

    dataID_list = []
    for dataID, in cursor:
        dataID_list.append(dataID)

    query = "SELECT id, recordedTime, pulse FROM RecoveriesData WHERE id IN({})".format(userID, str(dataID_list).strip('[]'))
    cursor.execute(query)

    close_connection(cursor, cnx)

    return [[dID, time, pulse] for dID, time, pulse, in cursor]
