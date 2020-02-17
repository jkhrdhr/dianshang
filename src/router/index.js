import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/childe/Welcome.vue'
import UserList from '../components/childe/UserList.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'
import Categories from '../components/shopping/Categories.vue'
import params from '../components//shopping/Params.vue'
import Goods from '../components/shopping/Goods.vue'
import Add from '../components/shopping/Add.vue'
import orders from '../components/indent/Orders.vue'

Vue.use(VueRouter)

const routes = [
      { path: '/', redirect: '/login' },
      { path: '/login', component: Login },
      {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                  { path: '/welcome', component: Welcome },
                  // 用户列表
                  { path: '/users', component: UserList },
                  // 角色列表
                  { path: '/roles', component: Roles },
                  // 权限列表
                  { path: '/rights', component: Rights },
                  // 商品列表
                  { path: '/goods', component: Goods },
                  // 分类参数
                  { path: '/params', component: params },
                  // 商品分类
                  { path: '/categories', component: Categories },
                  // 订单列表
                  { path: '/orders', component: orders },
                  // 数据统计
                  { path: '/reports', component: Welcome },
                  { path: '/goods/add', component: Add }
            ]
      }
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
