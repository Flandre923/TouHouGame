from datetime import datetime, timedelta
import hashlib
import jwt

from flask import jsonify, request

from app import app
from config import Config
from models import User,UserInfo,RankData,Role

from functools import wraps

def token_required(role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            # print(token)
            if not token:
                return jsonify({'error': 'Token missing'}), 401
            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                if datetime.utcnow() > datetime.fromtimestamp(data['exp']):
                    return jsonify({'error': 'Token expired'}), 401
                if role is not None and data['role'] != role:
                    return jsonify({'error': 'Authorization not enough'}), 401
                return f(*args, **kwargs)
            except Exception as e:
                print(e)
                return jsonify({'error': 'Invalid token'}), 401
        return decorated_function
    return decorator



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
            return jsonify({'success': True,'role':user.role_id, 'message': 'Login successful', 'token': token}), 200
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
@token_required(role=2)
def admin():
    data = jwt.decode(request.headers.get('Authorization'), app.config['SECRET_KEY'], algorithms=['HS256'])
    return jsonify({'message': 'Hello, {}! This is an admin page.'.format(data['username'])})

# 需要token验证的接口
@app.route('/admin/users')
@token_required(role=2)
def admin_user():
    user_list = User.get_all()
    users_dict = [user.__dict__ for user in user_list]
    return jsonify(users_dict)

@app.route('/admin/roles',methods=['GET'])
@token_required(role=2)
def admin_role():
    role_list = Role.get_all()
    role_dict = [role.__dict__ for role in role_list]
    return jsonify(role_dict)


@app.route('/admin/users/update',methods=['POST'])
@token_required(role=2)
def admin_user_update():
    post_data = request.get_json()
    user_account = post_data.get('user_account')
    id  = user_account.get('id')
    username = user_account.get('username')
    role_id = user_account.get('role_id')
    user = User.get_by_username(username)
    if user.role_id == role_id:
        return jsonify({'message': 'Update successful'})
    user.update_role_id(role_id)
    return jsonify({'message': 'Update successful'})

@app.route('/admin/users/delete',methods=['GET'])
@token_required(role=2)
def admin_user_delete():
    user_id = request.args.get('id')
    print(user_id)
    User.delete_by_id(user_id)
    return jsonify({'message': 'Delete successful'})


@app.route('/admin/role/delete',methods=['GET'])
@token_required(role=2)
def admin_role_delete():
    user_id = request.args.get('my_id')
    print(user_id)
    Role.delete_by_id(user_id)
    return jsonify({'message': 'Delete successful'})


@app.route('/admin/role/update',methods=['POST'])
@token_required(role=2)
def admin_role_update():
    # 根据my_id更新数据
    post_data = request.get_json()
    id  = post_data.get('my_id')
    role_id = post_data.get('my_role_id')
    role_name = post_data.get('my_role_name')
    role = Role(id,role_id,role_name)
    role.update()
    return jsonify({'message': 'Update successful'})


@app.route('/admin/role/add',methods=['POST'])
@token_required(role=2)
def admin_role_add():
    # 添加一个Role
    post_data = request.get_json()
    print(post_data)
    role_id = post_data.get('my_role_id')
    role_name = post_data.get('my_role_name')
    role = Role(None,role_id,role_name)
    role.save()
    return jsonify({'message': 'Add successful'})


