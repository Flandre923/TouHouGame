from flask_mysql_connector import MySQL
from app import app
mysql = MySQL(app)


class User:
    def __init__(self,id=None, username=None, password=None, role_id=None):
        self.id = id
        self.username = username
        self.password = password
        self.role_id = role_id

    def save(self):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "INSERT INTO my_account (my_username, my_password, my_role_id) VALUES (%s, %s, %s)"
        cursor.execute(query, (self.username, self.password, self.role_id))
        conn.commit()
        cursor.close()

    @staticmethod
    def get_by_username(username):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT * FROM my_account WHERE my_username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return User(*result)
        else:
            return None


class UserInfo:
    def __init__(self, user_id=None, name=None, username=None, personal_info=None):
        self.user_id = user_id
        self.name = name
        self.username = username
        self.personal_info = personal_info

    def save(self):
        conn = mysql.connection
        cursor = conn.cursor()
        if self.user_id:
            query = "UPDATE my_user SET my_name = %s, my_username = %s, my_personal_info = %s WHERE user_id = %s"
            cursor.execute(query, (self.name, self.username, self.personal_info, self.user_id))
        else:
            query = "INSERT INTO my_user (my_name, my_username, my_personal_info) VALUES (%s, %s, %s)"
            cursor.execute(query, (self.name, self.username, self.personal_info))
            self.user_id = cursor.lastrowid
        conn.commit()
        cursor.close()

    @staticmethod
    def get_by_username(username):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT * FROM my_user WHERE my_username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return User(*result)
        else:
            return None

class RankData:
    def __init__(self, username=None, name=None, personal_info=None, score=None):
        self.username = username
        self.name = name
        self.personal_info = personal_info
        self.score = score

    @staticmethod
    def get_users():
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT my_user.my_username, my_user.my_name, my_user.my_personal_info, my_score.my_score FROM my_user, my_score WHERE my_user.my_username = my_score.my_username ORDER BY my_score DESC"
        cursor.execute(query)
        rows = cursor.fetchall()

        users = []
        for row in rows:
            user = User(username=row[0], name=row[1], personal_info=row[2], score=row[3])
            users.append(user)

        cursor.close()

        return users

