<template>
  <div class="container">
    <navbar-admin :logout="logout" />
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>登录账号</th>
          <th>角色</th>
          <th>玩家昵称</th>
          <th>玩家个人介绍</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>
            <!-- <b-form-select
              v-model="user.role_id"
              :options="roles"
              :value-field="'my_id'"
              :text-field="'my_role_name'"
            ></b-form-select> -->
            {{ getRoleName(user.role_id) }}
          </td>
          <td>{{ user.nickname }}</td>
          <td>{{ user.user_info }}</td>
          <td>
            <b-button variant="danger" @click="deleteUser(index)"
              >删除</b-button
            >
            <b-button variant="primary" @click="editUser(index)">修改</b-button>
          </td>
        </tr>
      </tbody>
    </table>
    <b-modal v-model="showEditModal" title="修改用户角色">
      <b-form-group label="玩家昵称">
        <b-form-input v-model="currentUser.nickname"></b-form-input>
      </b-form-group>
      <b-form-group label="玩家介绍">
        <b-form-textarea v-model="currentUser.user_info"></b-form-textarea>
      </b-form-group>
      <b-form-select
        v-model="currentUser.role_id"
        :options="roles"
        :value-field="'my_role_id'"
        :text-field="'my_role_name'"
      ></b-form-select>
      <template #modal-footer="{ ok }">
        <b-button
          variant="primary"
          @click="updateUser()"
          :disabled="!currentUser.role_id"
          >保存</b-button
        >
        <b-button variant="outline-secondary" @click="cancelEdit()"
          >取消</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import NavbarAdmin from "./navbarAdmin";

export default {
  components: {
    NavbarAdmin,
  },
  data() {
    return {
      users: [],
      roles: [],
      showEditModal: false,
      currentUser: {},
    };
  },
  mounted() {
    // 获取用户列表和角色列表
    this.getUsers();

    this.getRoles();
  },
  methods: {
    // 获得用户
    getUsers() {
      axios
        .get("http://localhost:5000/admin/users", {
          headers: {
            Authorization: `${localStorage.getItem("my_token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.users = response.data;
        });
    },
    //
    getRoles(){
      axios
      .get("http://localhost:5000/admin/roles", {
        headers: {
          Authorization: `${localStorage.getItem("my_token")}`,
        },
      })
      .then((response) => {
        this.roles = response.data;
        console.log(response.data);
      });
    },
    deleteUser(index) {
      // 删除用户
      const userId = this.users[index].id;
      axios
        .get(`http://localhost:5000/admin/users/delete`, {
          params: {
            id: userId,
          },
          headers: {
            Authorization: `${localStorage.getItem("my_token")}`,
          },
        })
        .then((response) => {
          this.users.splice(index, 1);
        });
      this.getUsers();
    },
    editUser(index) {
      // 显示修改用户角色的模态框
      this.currentUser = { ...this.users[index] };
      this.showEditModal = true;
    },

    updateUser() {
      // 更新用户信息
      const userId = this.currentUser.id;
      console.log(this.currentUser);
      const updatedUser = { my_role_id: this.currentUser.role_id };
      axios
        .post(
          "http://localhost:5000/admin/users/update",
          {
            user_account: this.currentUser,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("my_token")}`,
            },
          }
        )
        .then((response) => {
          this.roles = response.data;
          console.log(response.data);
        });
      this.showEditModal = false;
      this.getRoles();
      this.getUsers();
    },
    cancelEdit() {
      // 取消修改用户角色
      this.currentUser = {};
      this.showEditModal = false;
    },
    getRoleName(role_id) {
      if(!Array.isArray(this.roles)){
        return
      }
      const role = this.roles.find((r) => r.my_role_id === role_id);
      return role ? role.my_role_name : "1";
    },
    // 登出
    logout() {
      localStorage.removeItem("my_token");
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
