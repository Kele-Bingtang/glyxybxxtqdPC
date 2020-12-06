import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getCookie } from '@/utils/cookie' // get logininfo from cookie
import getPageTitle from '@/utils/get-page-title'
import requestConfig from '@/utils/requestConfig'
import axios from 'axios'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 非登录白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 配置json
  if (JSON.stringify(store.getters.config) == '{}') {
    let config = await requestConfig()
    await store.dispatch('app/setConfig', config)
    if (process.env.NODE_ENV === 'production') { // 生产环境
      axios.defaults.baseURL = config.api // 配置接口地址
    } else {
      axios.defaults.baseURL = process.env.VUE_APP_BASE_API
    }
  }
  // 设置网页标题
  document.title = getPageTitle(to.meta.title)

  // 检测cookie是否存在
  const hasCookie = getCookie()
  if (hasCookie) {
    if (to.path === '/login') {
      // 如果已经登录过，跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 获取申报中的报修单数量
        getDeclare()
        next()
      } else {
        try {
          // 拉取用户信息
          await store.dispatch('user/getInfo')
          // 获取申报中的报修单数量
          getDeclare()
          next()
        } catch (error) {
          // 移除token，跳转登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

// 获取申报中的数量
async function getDeclare() {
  if (!store.getters.bxdCount) {
    await store.dispatch('bxd/getDeclare')
  }
}
