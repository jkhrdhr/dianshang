import Vue from 'vue'
// import { Form, FormItem } from 'element-ui'

import { Button, Form, FormItem, Input, Option, Select, Table, Tree, Tag, TableColumn, Dialog, Pagination, Switch, Tooltip, Message, Card, Col, Row, Container, Header, Aside, Main, Submenu, Menu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem } from 'element-ui'
// Vue.use(Button, Form, FormItem, Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// 将Message以$message为名挂载到全局Vue的方法上，这样所有vm实例都可以使用这个方法
Vue.prototype.$message = Message
