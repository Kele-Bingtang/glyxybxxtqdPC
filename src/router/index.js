import Vue from 'vue'
import Router from 'vue-router'
import config from '@/config'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/pc/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/pc/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/pc/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index'
  },
  {
    path: '/index',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/views/pc/index'),
        meta: { title: '首页', icon: 'home', affix: true }
      }
    ]
  },
  {
    path: '/region',
    component: Layout,
    redirect: '/region/index',
    children: [
      {
        path: 'index',
        name: 'Region',
        component: () => import('@/views/pc/region/index'),
        meta: { title: '区域管理', icon: 'region', affix: false }
      }
    ]
  },
  {
    path: '/repair',
    component: Layout,
    redirect: '/repair/index',
    children: [
      {
        path: 'index',
        name: 'Repair',
        component: () => import('@/views/pc/repair/index'),
        meta: { title: '报修单', icon: 'list', badge: true }
      }
    ]
  },
  {
    path: '/receiver',
    component: Layout,
    redirect: '/receiver/index',
    children: [
      {
        path: 'index',
        name: 'Receiver',
        component: () => import('@/views/pc/receiver/index'),
        meta: { title: '接单人', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/checker',
    component: Layout,
    redirect: '/checker/index',
    children: [
      {
        path: 'index',
        name: 'Checker',
        component: () => import('@/views/pc/checker/index'),
        meta: { title: '审核员', icon: 'user' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/index',
    children: [
      {
        path: 'index',
        name: 'Material',
        component: () => import('@/views/pc/material/index'),
        meta: { title: '耗材管理', icon: 'tree', badge: false }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
