/*
 * 存储按钮信息
 */
const state = {
  /*
   * 菜单数据
   */
  menus: null,
  /*
   * 是否已经渲染菜单路由，默认为否(false)，因为刷新页面后需要重新添加
   * 路由 所以这个属性不需要存储到 SessionStorage，没次刷新后该属性值
   * 都会变为false，从而添加菜单的路由
   */
  routerReady: false,
  // 当前菜单信息
  currentMenu: null,

  pathMap: {},
}

const SESSION_STORAGE_KEY = '--MENUS-INFO--'
const CURRENT_MENU_SESSION_STORAGE_KEY = '--MENUS-INFO-CURRENT--'

const getters = {
  menus: state => {
    // debugger
    // if (!state.menus) {
    //   let menusStr = sessionStorage.getItem(SESSION_STORAGE_KEY)
    //   state.menus = menusStr ? JSON.parse(menusStr) : null
    // }
    return state.menus
  },
  routerReady: state => state.routerReady,
  // 获取个人的菜单
  personal: state => {
    // debugger
    // PERSONAL
    if (!state.menus) {
      return []
    }
    for (let key in state.menus) {
      if (state.menus[key].code === 'PERSONAL')
        return state.menus[key].children
    }
  },
  getByPath: state => path => {
    if (!state.menus || !path) {
      return null
    }

    let arr = []
    arr.push(...state.menus)
    while (arr.length > 0) {
      let m = arr.pop()
      if (m.path === path) {
        return m
      }
      if (m.children && m.children.length > 0) {
        arr.push(...m.children)
      }
    }

    return null
  }
}

// mutations
const mutations = {
  save (state, payload) {
    state.routerReady = payload.routerReady
    state.menus = payload.menus
    // 把按钮信息存储在 SessionStorage 中，防止刷新页面后没有了菜单数据
    // sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state.menus))
  },
  clear (state) {
    state.menus = null
    state.routerReady = false
    // sessionStorage.removeItem(SESSION_STORAGE_KEY);
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
