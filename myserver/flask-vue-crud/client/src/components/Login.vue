<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card mt-5">
          <div class="card-body">
            <h4 class="card-title text-center">用户登录</h4>
            <form @submit.prevent="login">
              <b-form-group label="用户名" label-for="username-input">
                <b-form-input
                  id="username-input"
                  type="email"
                  v-model="username"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group label="密码" label-for="password-input">
                <b-form-input
                  id="password-input"
                  type="password"
                  v-model="password"
                  required
                ></b-form-input>
              </b-form-group>
              <div class="d-flex justify-content-between">
                <b-button variant="primary" type="submit">登陆</b-button>
                <b-button variant="secondary" @click="register">注册</b-button>
              </div>
              <b-alert variant="danger" v-if="error" class="mt-3" show>{{
                error
              }}</b-alert>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      // 验证用户名是否是邮箱地址
      if (!this.validateEmail(this.username)) {
        this.error = "用户名必须是邮箱地址";
        return;
      }
      // 验证密码是否包含大小写和特殊字符
      if (!this.validatePassword(this.password)) {
        this.error = "密码必须包含大小写和特殊字符";
        alert(this.error);
        return;
      }
      // 发送请求到后台
      axios
        .post("http://localhost:5000/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          // 如果后台返回成功，跳转页面
          console.log(res);
          if (res.data.success) {
            // console.log(res.data.token);
            localStorage.setItem("my_token", res.data.token); // 将token存储在本地存储中
            localStorage.setItem("my_role",res.data.role_id);
            this.$router.push("/admin/user")
          } else {
            this.error = res.data.message;
          }
        })
        .catch((err) => {
          // 如果请求出错，提示信息
          console.log(err);
          this.error = "账号密码错误";
        });
    },
    register() {
      // 注册逻辑
      axios
        .get("http://localhost:5000/admin", {
          headers: {
            Authorization: `${localStorage.getItem("my_token")}`,
          },
        })
        .then((res) => {
          // 处理响应
          console.log(res.data)
        })
        .catch((err) => {
          // 处理错误
        });
    },
    validateEmail(email) {
      // 验证邮箱地址的正则表达式
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(email);
    },
    validatePassword(password) {
      // 验证密码是否包含大小写和特殊字符的正则表达式
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
      return regex.test(password);
    },
  },
};
</script>

<style scoped>
body {
  background-image: url("https://i0.hdslb.com/bfs/archive/8a7c0c3f1f9e0a1f9a7c9c2e6a8f2d8c3d7e1a5f.jpg");
  background-size: cover;
}

.container {
  height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #fb7299;
}

.b-button {
  width: 48%;
}

.b-button-primary {
  background-color: #00a1d6;
  border-color: #00a1d6;
}
</style>
