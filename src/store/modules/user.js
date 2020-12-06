import { login, getInfo } from '@/api/user'
import { getCookie, removeCookie } from '@/utils/cookie'
import router, { resetRouter } from '@/router'

const state = {
  token: getCookie(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response) {
          let { admin } = response
          admin = {
            qx: 7,
            xm: '系统管理员'
          }
          commit('SET_TOKEN', userInfo)
          commit('SET_NAME', admin.xm)
          commit('SET_ROLES', [admin.qx])
          resolve()
        } else {
          reject('验证失败，请重新登录.')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = typeof state.token === 'string' ? JSON.parse(state.token) : state.token
      getInfo(token).then(response => {
        if (response.status) {
          let { admin } = response
          admin = {
            qx: 7,
            xm: '系统管理员'
          }
          commit('SET_NAME', admin.xm)
          commit('SET_ROLES', [admin.qx])
          resolve()
        } else {
          reject('验证失败，请重新登录.')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLES', [])
      removeCookie()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_ROLES', [])
      removeCookie()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      console.log('changeRoles')
      const token = role + '-token'
      commit('SET_TOKEN', token)
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
