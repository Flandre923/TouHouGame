from flask import Flask,jsonify,request
from flask_mysql_connector import MySQL
from flask_cors import CORS
import hashlib

# configuration
DEBUG = True
# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
# enable CORS
CORS(app,resources={r'/*':{'origins':'*'}})

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE'] = 'test'
mysql = MySQL(app)

EXAMPLE_SQL = 'select * from test.my_account'


# using the new_cursor() method
@app.route('/new_cursor')
def new_cursor():
    cur = mysql.new_cursor(dictionary=True)
    cur.execute(EXAMPLE_SQL)
    output = cur.fetchall()
    return str(output)


# 定义一个/login请求的路由和方法
@app.route('/login', methods=['POST'])
def login():
    # 获取请求中发送的账号和密码
    post_data = request.get_json()
    print(post_data)
    username = post_data.get('username')
    password = post_data.get('password')
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    # 如果账号和密码都不为空
    print(password)
    if username and password:
        # 创建一个数据库游标
        cursor = mysql.connection.cursor()
        # 执行查询语句，从users表中查找匹配的账号和密码
        query = "SELECT * FROM my_account WHERE my_username = %s AND my_password = %s AND my_role_id = 2"
        cursor.execute(query, (username, password))
        # 获取查询结果
        result = cursor.fetchone()
        # 关闭游标
        cursor.close()
        # 如果查询结果不为空，说明登陆成功
        if result:
            # 返回一个json格式的响应，包含登陆成功的信息和状态码200
            return jsonify({'success':True,'message': 'Login successful'}), 200
        # 否则，说明登陆失败
        else:
            # 返回一个json格式的响应，包含登陆失败的信息和状态码401
            return jsonify({'success':False,'message': '账号密码错误'}), 401
    # 否则，说明请求参数不完整
    else:
        # 返回一个json格式的响应，包含参数缺失的信息和状态码400
        return jsonify({'message': 'Missing username or password'}), 400

@app.route('/register', methods=['POST'])
def register():
    
    post_data = request.get_json()
    print(post_data)
    username = post_data.get('my_username')
    password = post_data.get('my_password')
    name = post_data.get('my_name')
    my_personInfo = post_data.get('my_personinfo')
    # 获取表单数据

    # 将密码进行哈希加密
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

    # 在my_account表中插入数据
    conn = mysql.connection;
    cursor = conn.cursor()
    query = "INSERT INTO my_account (my_username, my_password, my_role_id) VALUES (%s, %s, 1)"
    cursor.execute(query, (username, hashed_password))
    conn.commit()

    # 在my_user表中插入数据
    user_query = "INSERT INTO my_user (my_name, my_username, my_personal_info) VALUES (%s, %s, %s)"
    cursor.execute(user_query, (name, username, my_personInfo))
    conn.commit()

    return jsonify({'success':True,'message': 'Register successful'}), 200



@app.route('/rank',methods=['GET'])
def rank():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT my_user.my_username, my_user.my_name, my_user.my_personal_info, my_score.my_score FROM my_user,my_score WHERE my_user.my_username = my_score.my_username ORDER BY my_score DESC') # 执行 SQL 查询语句
    rows = cursor.fetchall()

    users = []
    for row in rows:
        user = {
            'username': row[0],
            'name': row[1],
            'personal_info': row[2],
            'score': row[3]
        }
        users.append(user)

    cursor.close()  # 关闭游标连接

    return jsonify(users)  # 返回 json 格式的数据




# using the connection property
# @app.route('/connection')
# def connection():
#     conn = mysql.connection
#     cur = conn.cursor()
#     cur.execute(EXAMPLE_SQL)
#     output = cur.fetchall()
#     return str(output)

# # using the execute_sql() method to easily
# # select sql and optionally output to Pandas
# @app.route('/easy_execute')
# def easy_execute():
#     df = mysql.execute_sql(EXAMPLE_SQL, to_pandas=True)
#     return str(df.to_dict())

if __name__=='__main__':
    app.run()

