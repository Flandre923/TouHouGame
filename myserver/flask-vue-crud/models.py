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

    
    def update_role_id(self, new_role_id):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "UPDATE my_account SET my_role_id = %s WHERE my_id = %s"
        cursor.execute(query, (new_role_id, self.id))
        conn.commit()
        cursor.close()
        self.role_id = new_role_id
    
    @staticmethod
    def get_all():
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT my_id, my_username, my_role_id FROM my_account"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        users = []
        for result in results:
            users.append(User(result[0], result[1], None, result[2]))
        return users
    
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
    
    @staticmethod
    def get_by_id(user_id):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT * FROM my_account WHERE my_id = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return User(*result)
        else:
            return None
        
    @staticmethod
    def delete_by_id(user_id):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "DELETE FROM my_account WHERE my_id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()


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
            query = "UPDATE my_user SET my_name = %s, my_username = %s, my_personal_info = %s WHERE my_id = %s"
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
            return UserInfo(*result)
        else:
            return None
    
    @staticmethod
    def delete_by_username(username):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "DELETE FROM my_user WHERE my_username = %s"
        cursor.execute(query, (username,))
        conn.commit()
        cursor.close()

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
            user = RankData(username=row[0], name=row[1], personal_info=row[2], score=row[3])
            users.append(user)

        cursor.close()
        return users

    @staticmethod
    def insert_score(username, score):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "INSERT INTO my_score (my_username, my_score) VALUES (%s, %s)"
        cursor.execute(query, (username, score))
        conn.commit()
        cursor.close()

class Role:
    def __init__(self, my_id=None, my_role_id=None, my_role_name=None):
        self.my_id = my_id
        self.my_role_id = my_role_id
        self.my_role_name = my_role_name

    def save(self):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "INSERT INTO my_role (my_role_id, my_role_name) VALUES (%s, %s)"
        cursor.execute(query, (self.my_role_id, self.my_role_name))
        conn.commit()
        cursor.close()

    @staticmethod
    def get_all():
        conn = mysql.connection
        cursor = conn.cursor()
        query = "SELECT * FROM my_role"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        my_table_entries = []
        for result in results:
            my_table_entries.append(Role(*result))
        return my_table_entries

    def update(self):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "UPDATE my_role SET my_role_id = %s, my_role_name = %s WHERE my_id = %s"
        cursor.execute(query, (self.my_role_id, self.my_role_name, self.my_id))
        conn.commit()
        cursor.close()
    
    @staticmethod
    def delete_by_id(my_id):
        conn = mysql.connection
        cursor = conn.cursor()
        query = "DELETE FROM my_role WHERE my_id = %s"
        cursor.execute(query, (my_id,))
        conn.commit()
        cursor.close()

class Score:
    def __init__(self, id, username, score):
        self.id = id
        self.username = username
        self.score = score
    @staticmethod
    def get_all_users():
        # 连接 MySQL 数据库
        db = mysql.connection
        cursor = db.cursor()

        sql = "SELECT * FROM my_score"
        cursor.execute(sql)

        result = []
        for row in cursor.fetchall():
            score = Score(row[0], row[1], row[2])
            result.append(score.__dict__)

        cursor.close()
        db.close()

        return result
    
    @staticmethod
    def delete_user(id):
        # 连接 MySQL 数据库
        db = mysql.connection
        cursor = db.cursor()
        sql = "DELETE FROM my_score WHERE my_id = %s"
        val = (id,)
        cursor.execute(sql, val)
        db.commit()
        cursor.close()
        db.close()
        return 'success'


class AdminUserAccount:
    def __init__(self,id,username,role_id,nickname,user_info) -> None:
        self.id = id
        self.username = username
        self.role_id = role_id
        self.nickname = nickname
        self.user_info = user_info
    
    @staticmethod
    def getAllData():
        # assume we have a database connection object named "db"
        db = mysql.connection
        cursor = db.cursor()
        
        # execute the SQL query to join the my_account and my_user tables
        query = """
            SELECT my_account.my_id, my_account.my_username, my_account.my_role_id, 
                   my_user.my_name, my_user.my_personal_info
            FROM my_account
            JOIN my_user ON my_account.my_username = my_user.my_username
        """
        cursor.execute(query)
        
        # fetch all results
        results = cursor.fetchall()
        
        # create a list of AdminUserAccount objects from the results
        accounts = []
        for row in results:
            account = AdminUserAccount(*row)
            accounts.append(account)
        
        return accounts
