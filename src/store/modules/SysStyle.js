/*
 * 存储按钮信息
 */
const state = {
    baseStyle: {
        backgroundColor: '#447df7',
        color: '#ffffff'
    },
    btnClass: 'btn-primary'
}

const getters = {
    baseStyle: state => {
        return state.baseStyle
    },
    btnClass: state => {
        return state.btnClass
    }
}

export default {
    namespaced: true,
    state,
    getters
}
