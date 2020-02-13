import Vue from 'vue'
// import { Form, FormItem } from 'element-ui'

import { Button, Form, FormItem, Input, Message } from 'element-ui'
// Vue.use(Button, Form, FormItem, Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
// 将Message以$message为名挂载到全局Vue的方法上，这样所有vm实例都可以使用这个方法
Vue.prototype.$message = Message
