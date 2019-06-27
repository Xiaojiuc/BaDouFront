import Vue from 'vue'
import VueRouter from 'vue-router'
import LightBootstrap from './light-bootstrap-main'
// Plugins
import App from './App.vue'
import router from './routes/routes'
import Config from './config/config.js'
import store from './store'
import CustomValidateRules from './js/CustomValidateRules/index'


import {Table, TableColumn, Button, Row, Col, Radio} from 'element-ui'
Vue.use(Table) 
Vue.use(Button)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Radio)

// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(Config)
Vue.use(CustomValidateRules)

import '../static/UEditor/ueditor.config.js'
import '../static/UEditor/ueditor.all.js'
import '../static/UEditor/lang/zh-cn/zh-cn.js'
import '../static/UEditor/ueditor.parse.min.js'



/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})

