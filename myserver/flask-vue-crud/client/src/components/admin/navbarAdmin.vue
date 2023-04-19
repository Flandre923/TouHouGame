<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">管理后台</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item ">
            <router-link to="/" class="nav-link">返回排名</router-link>
          </li>
          <li class="nav-item active">
            <router-link to="/admin/user" class="nav-link">用户管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/role" class="nav-link">权限管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/score" class="nav-link">分数管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/userInfo" class="nav-link">用户信息管理</router-link>
          </li>
          <li class="nav-item">
            <b-button variant="purple" @click="logout">退出登录</b-button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
  props:{
    logout:{
      type:Function,
      required:true
    }
  },
  data () {
    return {}
  },
  methods:{
  }
}
</script>

<style scoped>
/* 样式可以根据需要进行修改 */
</style>