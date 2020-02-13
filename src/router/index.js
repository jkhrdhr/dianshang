import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
      { path: '/', redirect: '/login' },
      { path: '/login', component: Login },
      { path: '/home', component: Home }
]

const router = new VueRouter({
      routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
      // to代表要访问的页面
      // from代表从哪里来
      // next是一个函数，表示放行 有两种使用方式，第一种是next()直接放行
      // 一种是next('要去的地方')
      if (to.path === '/login') return next()
      const tokens = window.sessionStorage.getItem('token')
      if (!tokens) return next('/login')
      next()
})

export default router
