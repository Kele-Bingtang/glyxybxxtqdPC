import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'

import './ztree/js/jquery-3.3.1.min'
import './ztree/js/jquery.ztree.core'
import './ztree/js/jquery.ztree.excheck'
import './ztree/js/jquery.ztree.exedit'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import '@/styles/iconfont/iconfont.css' // iconfont
import '@/icons' // icon
import '@/permission' // permission control
// import 'lib-flexible/flexible.js'

// Import UI
import '@/ui/element-ui'
import ECharts from 'vue-echarts/dist/vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
require('echarts/theme/macarons') // echarts theme

// 注册组件后即可使用
Vue.component('v-chart', ECharts)

// Animate.css
import animated from 'animate.css'
import axios from 'axios';
Vue.use(animated)

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.config.productionTip = false
Vue.prototype.$moment = moment

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
