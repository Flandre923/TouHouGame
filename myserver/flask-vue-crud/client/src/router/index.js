import Vue from 'vue'
import VueRouter from 'vue-router'
import Ping from '../components/Ping.vue'
import Login from '../components/Login.vue'
import Rank from '../components/Rank.vue'
import Register from '../components/Register.vue'
import userAdmin from "../components/admin/userAdmin.vue"
import navBar from "../components/admin/navbarAdmin.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Rank',
    component: Rank,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/admin/user',
    name: 'userAdmin',
    component: userAdmin,
  },{
    path: '/admin/navbar',
    name: 'navBar',
    component: navBar,
  },
  {
    path: '/ping',
    name: 'Ping',
    component: Ping,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
