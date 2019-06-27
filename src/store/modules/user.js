/*
 * 存储按钮信息
 */
const state = {
  info: null
}

const SESSION_STORAGE_KEY = '--USER-INFO--'

const getters = {
  info: state => {
    if (!state.info) {
      let infoStr = sessionStorage.getItem(SESSION_STORAGE_KEY)
      state.info = infoStr ? JSON.parse(infoStr) : null
    }

    return state.info || {}
  }
}

// mutations
const mutations = {
  save (state, payload) {
    state.info = payload
    // 把用户信息存储在 SessionStorage 中，防止刷新页面后没有了菜单数据
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.info))
  },
  clear (state) {
    state.info = null
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
