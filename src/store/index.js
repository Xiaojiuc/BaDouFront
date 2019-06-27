import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import user from './modules/user'
import SysStyle from './modules/SysStyle'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        permission,
        user,
        SysStyle
    }
})
