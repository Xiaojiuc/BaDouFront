// Notifications plugin. Used on Notifications page
import Notifications from 'vue-notifyjs'

// A plugin file where you could register global components used across the app
import GlobalComponents from './globalComponents'
// A plugin file where you could register global directives
import GlobalDirectives from './globalDirectives'
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from './components/SidebarPlugin'
// Tabs plugin. Used on Panels page.
import VueTabs from 'vue-nav-tabs'

// element ui language configuration
import lang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

locale.use(lang)

// Validation plugin used to validate forms
import VeeValidate from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n';


// asset imports
import 'bootstrap/dist/css/bootstrap.css'
import 'vue-nav-tabs/themes/vue-tabs.scss'
import 'vue-notifyjs/themes/default.scss'
import './assets/sass/light-bootstrap-dashboard.scss'
import './assets/css/demo.css'

// library auto imports
import 'es6-promise/auto'

export default {
    async install(Vue) {
        Vue.use(GlobalComponents)
        Vue.use(GlobalDirectives)
        Vue.use(SideBar)
        Vue.use(Notifications)
        Vue.use(VueTabs)
        Vue.use(VueI18n)
        const i18n = new VueI18n({
            locale: 'zh_CN',
        })
        Vue.use(VeeValidate, {
            i18n,
            i18nRootKey: 'validation',
            fieldsBagName: 'fieldsBag',
            dictionary: {
                zh_CN
            }
        })
    }
}
