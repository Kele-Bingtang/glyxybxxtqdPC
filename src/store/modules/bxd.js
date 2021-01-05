import { getDeclareOrder } from '@/api/bxd'

const state = {
  bxdCount: null
}

const mutations = {
  SET_COUNT: (state, count) => {
    state.bxdCount = count
  }
}

const actions = {
  // 获取申报中的报修单数量
  getDeclare({ commit }) {
    return new Promise((resolve, reject) => {
      getDeclareOrder().then(response => {
        const  count  = response.obj.count;
        commit('SET_COUNT', count)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 退出登录，去掉缓存
  clearDeclare({ commit }) {
    commit('SET_COUNT', null)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
