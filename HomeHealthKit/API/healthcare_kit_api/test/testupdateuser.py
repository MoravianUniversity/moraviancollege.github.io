import mysql.connector as connector


def instantiate_connection():
    cnx = connector.connect(user='root', host='127.0.0.1', database='healthkitData')
    cursor = cnx.cursor()
    return cnx, cursor


def close_connection(cursor, cnx):
    cursor = None
    cnx.close()


def update_user_putQUERYTEST(userID, lastName = None, middleInitial = None, firstName = None, birthdate = None) -> str:
    query = "UPDATE Users SET "
    query_params = []

    if lastName != None:
        lastNameParam = "lastName=\"{}\"".format(lastName)
        query_params.append(lastNameParam)

    if middleInitial != None:
        middleInitialParam = "middleInitial=\"{}\"".format(middleInitial)
        query_params.append(middleInitialParam)

    if firstName != None:
        firstNameParam = "firstName=\"{}\"".format(firstName)
        query_params.append(firstNameParam)

    if birthdate != None:
        birthdateParam = "birthdate=\"{}\"".format(birthdate)
        query_params.append(birthdateParam)

    query_addition = ', '.join(query_params)
    query += query_addition
    query += " WHERE userID = {}".format(userID)

    return query


def main():
    query1 = update_user_putQUERYTEST(1)
    query2 = update_user_putQUERYTEST(2, "Fournier")
    query3 = update_user_putQUERYTEST(3, "Fournier", "C")
    query4 = update_user_putQUERYTEST(4, "Fournier", "C", "Gabe")
    query5 = update_user_putQUERYTEST(5, "Fournier", "C", "Gabe", "1995-05-10T10:00:00+00:00")

    print(query1)
    print(query2)
    print(query3)
    print(query4)
    print(query5)

main()