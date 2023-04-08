<template>
  <div class="container">
    <h1 class="mb-4">得分排行榜</h1>
    <!-- 搜索框 -->
    <b-form-input v-model="search" placeholder="搜索用户名称"></b-form-input>
    <!-- 排行榜表格 -->
    <b-table :items="sortedUsers" :fields="fields" :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"></b-table>
    <!-- 分页器 -->
    <b-pagination v-model="currentPage" :total-rows="users.length" :per-page="perPage"></b-pagination>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  data() {
    return {
      users: [], // 所有用户数据
      search: '', // 搜索关键字
      perPage: 10, // 每页显示10条记录
      currentPage: 1, // 当前页码
      sortBy: 'score', // 排序字段为score（得分）
      sortDesc: true, // 降序排列
      fields: [
        { key: 'username', label: '用户名称' },
        { key: 'name', label: '用户昵称' },
        { key: 'personal_info', label: '用户介绍' },
        { key: 'score', label: '得分', sortable: true },
      ],
    };
  },
  created() {
    axios.get("http://localhost:5000/rank").then(response => {
      this.users = response.data;
    }).catch(error => {
      console.error(error);
    });
  },
  computed: {
    sortedUsers() {
      // 根据关键字筛选符合条件的用户数据
      const filteredUsers = this.users.filter(user => {
        return user.username.toLowerCase().includes(this.search.toLowerCase());
      });
      // 根据sortBy和sortDesc进行排序
      const sortedUsers = filteredUsers.sort((a, b) => {
        if (this.sortDesc) {
          return b[this.sortBy] - a[this.sortBy];
        } else {
          return a[this.sortBy] - b[this.sortBy];
        }
      });
      // 根据perPage和currentPage进行分页
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return sortedUsers.slice(start, end);
    },
  },
};

</script>   