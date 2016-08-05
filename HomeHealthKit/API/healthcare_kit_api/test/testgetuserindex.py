import mysql.connector as connector


def instantiate_connection():
    cnx = connector.connect(user='root', host='127.0.0.1', database='healthkitData')
    cursor = cnx.cursor()
    return cnx, cursor


def close_connection(cursor, cnx):
    cursor = None
    cnx.close()


def get_user_index_getQUERYTEST(lastName = None, middleInitial = None, firstName = None, birthdate = None) -> str:
    params = [lastName, middleInitial, firstName, birthdate]
    if params.count(None) == 4:
        query = "SELECT userID, lastName, middleInitial, firstName, birthdate FROM Users"
    else:
        query = "SELECT userID, lastName, middleInitial, firstName, birthdate FROM Users WHERE "
        query_params = []

        if lastName != None:
            lastNameParam = "lastName REGEX \"{}\"".format(lastName)
            query_params.append(lastNameParam)

        if firstName != None:
            firstNameParam = "firstName REGEX \"{}\"".format(firstName)
            query_params.append(firstNameParam)

        if middleInitial != None:
            middleInitialParam = "middleInitial=\"{}\"".format(middleInitial)
            query_params.append(middleInitialParam)

        if birthdate != None:
            birthdateParam = "birthdate REGEX \"{}\"".format(birthdate)
            query_params.append(birthdateParam)

        query_addition = ' AND '.join(query_params)
        query += query_addition

    return query


def main():
    query1 = get_user_index_getQUERYTEST()
    query2 = get_user_index_getQUERYTEST("Fournier")
    query3 = get_user_index_getQUERYTEST("Fournier", "C")
    query4 = get_user_index_getQUERYTEST("Fournier", "C", "Gabe")
    query5 = get_user_index_getQUERYTEST("Fournier", "C", "Gabe", "1995-05-10T10:00:00+05:00")
    query6 = get_user_index_getQUERYTEST("Fournier", None, "Gabe")

    print(query1)
    print(query2)
    print(query3)
    print(query4)
    print(query5)
    print(query6)


main()
