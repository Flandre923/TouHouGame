<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">博客后台</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link to="/" class="nav-link">主页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/posts" class="nav-link">文章管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link">分类管理</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tags" class="nav-link">标签管理</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {}
  }
}
</script>

<style scoped>
/* 样式可以根据需要进行修改 */
</style>