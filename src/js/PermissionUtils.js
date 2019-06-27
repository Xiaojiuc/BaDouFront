/**
 * 获取菜单权限，动态添加路由。
 * 菜单所对应的页面写在 src/view 下
 * 在后台配置菜单时，菜单URL上写上该页面在 view 目录下的相对路径
 * 如：当前目录结构为
 * -src
 * --view
 * ---user
 * ----UserList.vue
 * URL填写内容为：user/UserList，注意，不需要 .vue 后缀
 * 该页面的访问路径为：/user/userlist，注意，访问路径全小写
 *
 * 如果需要带上参数，与平时写URL参数的写法一致，
 * 如：/user/userlist?mdCode=user&id=123
 * 解析后路由路径为：/user/userlist/:mdCode/:id
 * 实际访问路径为：  /user/userlist/user/123
 * 在 VUE 组件中 通过 this.$route.params 获取参数，如：this.$route.params.mdCode, this.$route.params.id
 */

import DashboardLayout from '@/pages/Dashboard/Layout/DashboardLayout.vue'

import Vue from 'vue'
import router from 'src/routes/routes'
import store from 'src/store'

// const _import = require('@/routes/_import_' + process.env.NODE_ENV)
const _import = require('@/routes/_import_development')

/**
 * 通过后台接口获取菜单信息
 * @param {Function} callback 获取到菜单数据后的回调函数
 */
function getMenus(callback) {
    Vue.prototype.get(Vue.prototype.INTERFACE.userMenu, {}, (isSuccess, res) => {
        callback(res)
    }, true)
}

/**
 * 根据菜单信息动态生成路由，把生成的路由添加到 VUE 的路由中，使用 VUEX 来存储菜单信息
 * @param {Array} menus 菜单信息
 * @param {Function} callback 添加路由后的回调函数
 */
function addMenuRouters(menus, callback) {
    let r = processRouter(menus)
    router.addRoutes(r)
    store.commit('permission/save', {menus: menus, routerReady: true})
    callback()
}

/**
 * 遍历菜单树，生成路由
 * @param {Array} menuInfo 菜单数组
 * @returns {Array} 路由数组
 */
function processRouter(menuInfo) {
    let routers = []
    let stack = []

    menuInfo.forEach(m => stack.push(m))

    while (stack.length > 0) {
        let m = stack.pop()
        if (m.children && m.children.length > 0) {
            m.children.forEach(cm => stack.push(cm))
        }
        if (!m.component) {
            continue
        }
        try {
            let r = genRouter(m);
            routers.push(r)
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                // 在开发环境下打印所有的异常
                //   console.error(e)
            } else if (!e.message || e.message.indexOf('Cannot find module') === -1)
            /*
             * 生产环境下打印除了 Cannot find module 外的异常，Cannot find module异常在
             * 没有找到菜单对应组件时抛出
             */
                console.error(e)
        }
    }
    return routers
}

/**
 * 封装路由对象所有菜单的路由的父组件都为 pages/Dashboard/Layout/DashboardLayout.vue
 * @param {Object} menu 菜单信息
 * @returns {Object} 路由对象
 */
function genRouter(menu) {
    let r = {}
    r.name = menu.id
    r.component = _import(menu.component)
    r.path = menu.component.toLowerCase();
    menu.path = '/' + r.path
    if (menu.params) {
        let p = processParams(menu.params)
        r.path += p.routerParams
        menu.path += p.realParams
        menu.query = p.query
    }

    return {
        path: '/',
        component: DashboardLayout,
        children: [r]
    }
}

/**
 * 处理URL上的参数
 * @param {String} urlParams 格式为：param1=xxx&param2=xxx 的字符串
 * @return {{routerParams: string, realParams: string}}
 */
function processParams(urlParams) {
    let query = {}
    urlParams.split('&').forEach(p => {
        let arr = p.split('=')
        query[arr[0]] = arr[1]
    })

    let routerParams = ''
    let realParams = ''
    // 如果参数中带有模型编码(mdCode)，把模型编码作为URL参数，以便区分不同的模型页面
    if (query.mdCode) {
        routerParams = '/:mdCode/:symbol'
        let symbol = query.symbol || 'placeholder'
        realParams = `/${query.mdCode}/${symbol}`
        delete query.mdCode
        delete query.symbol
    }
    return {
        routerParams,
        realParams,
        query
    }
}

export default {
    /**
     * 该方法在 routes.js 中的 router.beforeEach 的回调中调用，用于动态生成路由
     * @param {Function} callback 添加完路由后的回调函数
     */
    dynamicRoute(callback) {
        let menus = store.getters['permission/menus']

        if (menus) {
            addMenuRouters(menus, callback)
            return
        }

        getMenus(function (menus) {
            addMenuRouters(menus, callback)
        })
    },
    /**
     * 判断是否已经生成路由
     * @returns
     *   true：已生成路由，并且已经添加到了 VUE 的路由中
     *   false：未生成路由
     */
    isLoad() {
        return store.getters['permission/routerReady']
    },
    addRouter(obj) {
        let component = obj.component
        if (typeof component === 'string') {
            component = _import(component)
        }

        let parent = obj.parent
        if (parent === 'DashboardLayout') {
            parent = DashboardLayout
        } else if (parent) {
            parent = _import(component)
        }

        let r = {
            path: obj.path,
            component: component
        }
        if (parent) {
            r = {
                path: '/',
                component: parent,
                children: [r]
            }
        }
        router.addRoutes([r])
    }
}
