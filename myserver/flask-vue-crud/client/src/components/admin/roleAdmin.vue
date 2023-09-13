<template>
  <div class="container">
    <navbar-admin :logout="logout" />
    <b-table striped hover :items="roles" :fields="fields">
      <template #cell(actions)="row">
        <b-button-group size="sm">
          <b-button @click="editrole(row.item)" variant="primary">编辑</b-button>
          <b-button @click="deleterole(row.item)" variant="danger">删除</b-button>
        </b-button-group>
      </template>
    </b-table>
    <b-modal v-model="showModal" title="Edit role">
      <div class="form-group">
        <label for="role_id">Role ID:</label>
        <input type="text" class="form-control" id="role_id" v-model="currentrole.my_role_id">
      </div>
      <div class="form-group">
        <label for="role_name">Role Name:</label>
        <input type="text" class="form-control" id="role_name" v-model="currentrole.my_role_name">
      </div>
      <b-button-group>
        <b-button @click="saverole" variant="primary">保存</b-button>
        <b-button @click="cancelEdit" variant="secondary">取消</b-button>
      </b-button-group>
    </b-modal>
    <div class="mt-3">
      <h2>添加权限</h2>
      <div class="form-group">
        <label for="role_id">权限ID:</label>
        <input type="text" class="form-control" id="role_id" v-model="newrole.my_role_id">
      </div>
      <div class="form-group">
        <label for="role_name">权限名称:</label>
        <input type="text" class="form-control" id="role_name" v-model="newrole.my_role_name">
      </div>
      <b-button @click="addRole" variant="primary">添加权限</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import NavbarAdmin from './navbarAdmin'

export default {
  components:{
    NavbarAdmin
  },
  data() {
    return {
      fields: [
        { key: 'my_role_id', sortable: true },
        { key: 'my_role_name', sortable: true },
        { key: 'actions' }
      ],
      roles: [{
        'my_id':1,
        'my_role_id':1,
        'my_role_name':'普通'
      }],
      showModal: false,
      currentrole: {
        'my_id':1,
        'my_role_id':1,
        'my_role_name':'普通'
      },
      newrole: {
        my_role_id: '',
        my_role_name: ''
      }
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    getRoles() {
      axios.get('http://localhost:5000/admin/roles',{headers: {
            Authorization: `${localStorage.getItem("my_token")}`,
          }}).then(response => {
        this.roles = response.data
      })
    },
    addRole() {
      axios.post('http://localhost:5000/admin/role/add',this.newrole,{
  headers: {
    Authorization: `${localStorage.getItem("my_token")}`,
  }
  }).then(response => {
        this.newrole = { my_role_id: '', my_role_name: '' }
        this.getRoles()
      })
    },
    editrole(role) {
      this.currentrole = role
      this.showModal = true
    },
    saverole() {
      axios.post('http://localhost:5000/admin/role/update',this.currentrole,{
  headers: {
    Authorization: `${localStorage.getItem("my_token")}`,
  }
  }).then(response => {
        this.showModal = false
        this.getRoles()
      })
    },
    cancelEdit() {
      this.showModal = false
    },
    deleterole(role_object) {
      if (window.confirm('Are you sure you want to delete this role?')) {
        axios.get('http://localhost:5000/admin/role/delete',{
          params: { my_id: role_object.my_id } ,
          headers: {
            Authorization: `${localStorage.getItem("my_token")}`,
          }
        }).then(response => {
          this.getRoles()
        })
        this.getRoles()
      }
    },
    logout(){
      localStorage.removeItem("my_token");
      this.$router.push("/login")
    }
  }
}
</script>