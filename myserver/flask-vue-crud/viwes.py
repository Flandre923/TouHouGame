from datetime import datetime, timedelta
import hashlib
import jwt

from flask import jsonify, request

from app import app
from config import Config
from models import User,UserInfo,RankData,mysql

@app.route('/login', methods=['POST'])
def login():
    post_data = request.get_json()
    username = post_data.get('username')
    password = post_data.get('password')
    password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    if username and password:
        user = User.get_by_username(username)
        if user and user.password == password:
            token = jwt.encode({
                'username': username,
                'role': user.role_id,
                'exp': datetime.utcnow() + timedelta(days=1)
            }, Config.SECRET_KEY, algorithm='HS256')
            return jsonify({'success': True, 'message': 'Login successful', 'token': token}), 200
        else:
            return jsonify({'success': False, 'message': '账号密码错误'}), 401
    else:
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

    # 创建用户对象
    user = User(username=username, password=hashed_password, role_id=1)

    # 保存用户对象到数据库
    user.save()

    # 在my_user表中插入数据
    userinfo = UserInfo(None,name,username,my_personInfo)
    
    # 保存用户对象到数据库
    userinfo.save()
    # conn = mysql.connection;
    # cursor = conn.cursor()
    # user_query = "INSERT INTO my_user (my_name, my_username, my_personal_info) VALUES (%s, %s, %s)"
    # cursor.execute(user_query, (name, username, my_personInfo))
    # conn.commit()

    return jsonify({'success':True,'message': 'Register successful'}), 200



@app.route('/rank',methods=['GET'])
def rank():
    # cursor = mysql.connection.cursor()
    # cursor.execute('SELECT my_user.my_username, my_user.my_name, my_user.my_personal_info, my_score.my_score FROM my_user,my_score WHERE my_user.my_username = my_score.my_username ORDER BY my_score DESC') # 执行 SQL 查询语句
    # rows = cursor.fetchall()

    # users = []
    # for row in rows:
    #     user = {
    #         'username': row[0],
    #         'name': row[1],
    #         'personal_info': row[2],
    #         'score': row[3]
    #     }
    #     users.append(user)

    # cursor.close()  # 关闭游标连接

    # return jsonify(users)  # 返回 json 格式的数据

    users = RankData.get_users()
    users_dict = [user.__dict__ for user in users]
    return jsonify(users_dict)

# 需要token验证的接口
@app.route('/admin')
def admin():
    # 获取请求中的token
    token = request.headers.get('Authorization')
    print(token)
    if not token:
        return jsonify({'error': 'Token missing'}), 401
    try:
        # 解码token
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        # 检查token是否过期
        if datetime.utcnow() > datetime.fromtimestamp(data['exp']):
            return jsonify({'error': 'Token expired'}), 401
        # 返回受保护的资源
        return jsonify({'message': 'Hello, {}! This is an admin page.'.format(data['username'])})
    except:
        return jsonify({'error': 'Invalid token'}), 401

# using the new_cursor() method
@app.route('/new_cursor')
def new_cursor():
    EXAMPLE_SQL = 'select * from test.my_account'
    cur = mysql.new_cursor(dictionary=True)
    cur.execute(EXAMPLE_SQL)
    output = cur.fetchall()
    return str(output)
