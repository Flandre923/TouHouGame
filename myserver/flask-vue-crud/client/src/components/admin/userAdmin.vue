<template>
  <div class="container">

    <!-- 搜索框 -->
    <b-form-group id="searchBox" label="搜索">
      <b-input-group>
        <b-form-input v-model="searchKeyword" placeholder="请输入关键词"></b-form-input>
        <b-input-group-append>
          <b-button variant="primary" @click="search">搜索</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <!-- 数据列表 -->
    <b-table striped hover :items="items" :fields="fields">
      <template slot="actions" slot-scope="row">
        <b-button size="sm" variant="outline-secondary" @click="editItem(row.item)">编辑</b-button>
        <b-button size="sm" variant="outline-danger" @click="deleteItem(row.item)">删除</b-button>
      </template>
    </b-table>

    <!-- 添加/编辑数据模态框 -->
    <b-modal ref="itemModal" :title="modalTitle" hide-footer>
      <b-form ref="itemForm" @submit.prevent="saveItem">
        <b-form-group label="标题" label-for="title">
          <b-form-input id="title" v-model="currentItem.title"></b-form-input>
        </b-form-group>
        <b-form-group label="内容" label-for="content">
          <b-form-textarea id="content" v-model="currentItem.content"></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">保存</b-button>
      </b-form>
    </b-modal>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      items: [], // 数据列表
      fields: ['title', 'content', { key: 'actions', label: '操作' }], // 列表字段
      searchKeyword: '', // 搜索关键词
      currentItem: {}, // 当前编辑/添加的数据
      modalTitle: '', // 模态框标题
    }
  },
  mounted() {
    // 页面加载时获取数据列表
    this.fetchData()
  },
  methods: {
    // 获取数据列表
    fetchData() {
      axios.get('/api/items', {
        params: { keyword: this.searchKeyword }
      })
      .then(response => {
        this.items = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },

    // 搜索数据
    search() {
      this.fetchData()
    },

    // 打开添加数据模态框
    addItem() {
      this.currentItem = {}
      this.modalTitle = '添加数据'
      this.$refs.itemModal.show()
    },

    // 打开编辑数据模态框
    editItem(item) {
      this.currentItem = {...item}
      this.modalTitle = '编辑数据'
      this.$refs.itemModal.show()
    },

    // 保存数据
    saveItem() {
      axios.post('/api/items', this.currentItem)
        .then(response => {
          this.$refs.itemModal.hide()
          this.fetchData()
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 删除数据
    deleteItem(item) {
      if (confirm('确定要删除该条数据吗？')) {
        axios.delete(`/api/items/${item.id}`)
          .then(response => {
            this.fetchData()
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
  }
}
</script>


<style>
.container {
    margin-top: 60px
}
</style>