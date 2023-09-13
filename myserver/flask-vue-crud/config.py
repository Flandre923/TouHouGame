import secrets

class Config:
    SECRET_KEY = secrets.token_hex(16)

    # MySQL 配置信息
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'root'
    MYSQL_DATABASE = 'test'