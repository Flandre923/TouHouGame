import Vue from 'vue'
import VueRouter from 'vue-router'
import Ping from '../components/Ping.vue'
import Login from '../components/Login.vue'
import Rank from '../components/Rank.vue'
import Register from '../components/Register.vue'
import userAdmin from "../components/admin/userAdmin.vue"
import roleAdmin from "../components/admin/roleAdmin.vue"
import scoreAdmin from "../components/admin/scoreAdmin.vue"
import userInfoAdmin from "../components/admin/userInfoAdmin"
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
    meta: { requiresAuth: true },
    component: userAdmin,
  },
  {
    path: '/admin/role',
    name: 'roleAdmin',
    meta: { requiresAuth: true },
    component: roleAdmin,
  },
  {
    path: '/admin/score',
    name: 'scoreAdmin',
    meta: { requiresAuth: true },
    component: scoreAdmin,
  },
  {
    path: '/admin/userInfo',
    name: 'userInfoAdmin',
    meta: { requiresAuth: true },
    component: userInfoAdmin,
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

router.beforeEach((to,from,next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const accessToken = localStorage.getItem("my_token")
  const accessRole = localStorage.getItem('my_role')
  if (requiresAuth && !accessToken && accessRole !== '2') {
    next('/login')
  } else {
    next()
  }
})
export default router
