<template>
  <div class="register-form">
    <b-card title="用户注册" :sub-title="subtitle">
      <b-form @submit.prevent="onSubmit" v-if="show">
        <b-form-group
          id="emailGroup"
          label="邮箱地址:"
          label-for="emailInput"
          :state="emailState"
        >
          <b-form-input
            id="emailInput"
            v-model="form.email"
            type="email"
            required
            :state="emailState"
            placeholder="请输入您的邮箱地址"
          ></b-form-input>
          <b-form-invalid-feedback :state="emailState">
            请输入一个有效的邮箱地址
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="passwordGroup"
          label="密码:"
          label-for="passwordInput"
          :state="passwordState"
        >
          <b-form-input
            id="passwordInput"
            v-model="form.password"
            type="password"
            required
            :state="passwordState"
            placeholder="请输入密码"
          ></b-form-input>
          <b-form-invalid-feedback :state="passwordState">
            密码必须包含大写字母、小写字母、数字和特殊符号
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="confirmGroup"
          label="确认密码:"
          label-for="confirmInput"
          :state="confirmState"
        >
          <b-form-input
            id="confirmInput"
            v-model="form.confirm"
            type="password"
            required
            :state="confirmState"
            placeholder="请再次输入密码"
          ></b-form-input>
          <b-form-invalid-feedback :state="confirmState">
            两次输入的密码必须一致
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="nicknameGroup"
          label="昵称:"
          label-for="nicknameInput"
        >
          <b-form-input
            id="nicknameInput"
            v-model="form.nickname"
            type="text"
            placeholder="请输入您的昵称"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="introGroup" label="个人介绍:" label-for="introInput">
          <b-form-textarea
            id="introInput"
            v-model="form.intro"
            :rows="3"
            :max-rows="6"
            placeholder="请填写您的个人介绍"
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">注册</b-button>
      </b-form>
      <div v-else>
        <p class="mb-0">恭喜您，注册成功！</p>
        <p class="mb-0">您已经可以在游戏中登陆</p>
        <b-button @click="goToLogin">返回排行页面</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirm: "",
        nickname: "",
        intro: "",
      },
      show: true,
      isPassWord:false,
      isEmail:false,
      isCorrent:false
    };
  },

  computed: {
    subtitle() {
      return this.show ? "" : "注册成功";
    },

    emailState() {
      const email = this.form.email;
      if (!email) return null;
      var isValid = /\S+@\S+\.\S+/.test(email);
      this.isEmail = isValid;
      return isValid;
    },

    passwordState() {
      const password = this.form.password;
      if (!password) return null;
      var isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password);
      console.log(isValid);
      this.isPassWord = isValid;
      return isValid;
    },

    confirmState() {
      const confirm = this.form.confirm
      if (!confirm) return null
      this.isCorrent = this.form.password === confirm;
      return this.form.password === confirm;
    },
  },

  methods: {
    onSubmit() {
      if(this.isPassWord == false || this.isEmail == false || this.isCorrent == false){
        console.log(this.isCorrent,this.isPassWord,this.isEmail)
        alert("密码必须包含大写字母、小写字母、数字和特殊符号")
        return
      }
      const data = {
        my_username: this.form.email,
        my_password: this.form.password,
        my_name: this.form.nickname,
        my_personinfo: this.form.intro,
      };
      axios
        .post("http://localhost:5000/register", data)
        .then((response) => {
          console.log(response.data);
          this.show = false;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },

    goToLogin(){
        this.$router.push('/')
    }
  },
};
</script>

<style scoped>
.register-form {
  max-width: 600px;
  margin: 0 auto;
}

.b-form-invalid-feedback {
  font-size: 0.8em;
  color: #dc3545;
}
</style>
