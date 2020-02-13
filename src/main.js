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
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.axios = axios
Vue.config.productionTip = false

new Vue({
      router,
      render: h => h(App)
}).$mount('#app')
