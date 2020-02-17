import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局css样式表
import './assets/css/global.css'
// 导入字体图标样式库
import './assets/fonts/iconfont.css'
// 导入axios,并配置
import axios from 'axios'
// 注册文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入vue-table-with-tree-grid插件
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(VueQuillEditor)
Vue.component('tree-table', ZkTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
      config.headers.Authorization = window.sessionStorage.getItem('token')
      // console.log(config)
      return config
})
Vue.prototype.axios = axios
Vue.config.productionTip = false
// 全局时间过滤器
Vue.filter('getTime', function (times) {
      const newdate = new Date(times)
      const y = newdate.getFullYear()
      const m = (newdate.getMonth() + 1 + '').padStart(2, '0')
      const d = (newdate.getDate() + '').padStart(2, '0')
      const h = (newdate.getHours() + '').padStart(2, '0')
      const f = (newdate.getMinutes() + '').padStart(2, '0')
      const s = (newdate.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d}  ${h}:${f}:${s}`
})
new Vue({
      router,
      render: h => h(App)
}).$mount('#app')
