const { ccclass, property } = cc._decorator;
// import axios from 'axios'
@ccclass
export default class LoginScript extends cc.Component {

    @property(cc.EditBox)
    usernameEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBox: cc.EditBox = null;

    onLoad() {
    }

    onClick() {
        const username = this.usernameEditBox.string.trim();
        const password = this.passwordEditBox.string.trim();
        // TODO: 发送登陆请求
        // 邮箱地址合法性检查
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(username)) {
            // console.log('请输入有效的邮箱地址！');
            this.showErrorMessage("请输入有效的邮箱地址！")
            return;
        }

        // 密码检查
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            // console.log('密码应至少包含一个大写字母、一个小写字母、一个数字以及一个特殊符号，并且长度不得少于8个字符！');
            this.showErrorMessage("密码应至少包含一个大写字母、一个小写字母、一个数字以及一个特殊符号，并且长度不得少于8个字符！")
            return;
        }
        console.log("" + username + ":" + password)

        // this.login(username, password);
        this.login3(username,password);
    }

    showErrorMessage(msg: string) {
        const labelNode = this.node.parent.getChildByName('ErrorLabel');
        labelNode.getComponent(cc.Label).string = msg;
        labelNode.active = true;
    }

    login(username:string,password:string){
        // 使用axios发送请求，但是在客户端无法使用
        console.log(2131231)
        // const axios = require('axios')
        // axios.get("http://localhost:5000/new_cursor").then(response=>{
        //     console.log(response.data)
        //     console.log("@!312311231")
        // }).catch(error=>{
        //     console.log(error)
        // })
    }
    login2(){
        // 请求获得数据
        cc.loader.load('http://localhost:5000/new_cursor', (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(res); // 返回响应数据
        });

    }
    login3(username:string,password:string):void{
        const url = 'http://localhost:5000/new_cursor';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
    
        // 设置请求头（Content-Type和其他需要的信息）
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        // 监听请求状态的变化
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
            }
        };
    
        // 发送请求
        const data = { 'username': username,'password':password };
        xhr.send(JSON.stringify(data));
    }

    
    registerButtonClick(){
        // window.open("http://www.baidu.com");
        // window.location.href = 'https://www.example.com';
        cc.sys.openURL('http://localhost:8080/register');
    }
}
