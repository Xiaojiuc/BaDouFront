import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue'
// Dashboard pages
import Overview from 'src/pages/Dashboard/Dashboard/Overview.vue'
import Stats from 'src/pages/Dashboard/Dashboard/Stats.vue'
// Pages
import User from 'src/pages/Dashboard/Pages/UserProfile.vue'
import TimeLine from 'src/pages/Dashboard/Pages/TimeLinePage.vue'
import Login from 'src/pages/Dashboard/Pages/Login.vue'
import Register from 'src/pages/Dashboard/Pages/Register.vue'
import Lock from 'src/pages/Dashboard/Pages/Lock.vue'
import Modifypsw from 'src/pages/Dashboard/Pages/Modifypsw.vue'
import BdIconlibrary from 'src/pages/Dashboard/Pages/BdIconlibrary.vue'
import BdIconFontsome from 'src/pages/Dashboard/Pages/BdIconlibrary-fontsome.vue'
//权限菜单
import MenuPermission from 'src/pages/Dashboard/Pages/menuPermission.vue'

//组织结构
import Staffmanage from 'src/pages/Dashboard/Staff/staffmanage.vue'
import Departmentmanage from 'src/pages/Dashboard/Staff/departmentmanage.vue'

// EquipmentLedgerManagement pages
import EquipmentAccountInquiry from 'src/pages/Dashboard/EquipmentLedgerManagement/EquipmentAccountInquiry.vue'
import FunctionalLocationManagement
  from 'src/pages/Dashboard/EquipmentLedgerManagement/FunctionalLocationManagement.vue'
import NewEquipmentAssets from 'src/pages/Dashboard/EquipmentLedgerManagement/NewEquipmentAssets.vue'
import ChangeEquipmentAssets from 'src/pages/Dashboard/EquipmentLedgerManagement/ChangeEquipmentAssets.vue'

// Components pages
import Buttons from 'src/pages/Dashboard/Components/Buttons.vue'
import GridSystem from 'src/pages/Dashboard/Components/GridSystem.vue'
import Panels from 'src/pages/Dashboard/Components/Panels.vue'

const SweetAlert = () => import('src/pages/Dashboard/Components/SweetAlert.vue')
import Notifications from 'src/pages/Dashboard/Components/Notifications.vue'
import Icons from 'src/pages/Dashboard/Components/Icons.vue'
import Typography from 'src/pages/Dashboard/Components/Typography.vue'

// Forms pages
const RegularForms = () => import('src/pages/Dashboard/Forms/RegularForms.vue')
const ExtendedForms = () => import('src/pages/Dashboard/Forms/ExtendedForms.vue')
const ValidationForms = () => import('src/pages/Dashboard/Forms/ValidationForms.vue')
const Wizard = () => import('src/pages/Dashboard/Forms/Wizard.vue')

// TableList pages
const RegularTables = () => import('src/pages/Dashboard/Tables/RegularTables.vue')
const ExtendedTables = () => import('src/pages/Dashboard/Tables/ExtendedTables.vue')
const PaginatedTables = () => import('src/pages/Dashboard/Tables/PaginatedTables.vue')
// Maps pages
const GoogleMaps = () => import('src/pages/Dashboard/Maps/GoogleMaps.vue')
const FullScreenMap = () => import('src/pages/Dashboard/Maps/FullScreenMap.vue')
const VectorMaps = () => import('src/pages/Dashboard/Maps/VectorMapsPage.vue')

// Calendar
const Calendar = () => import('src/pages/Dashboard/Calendar/CalendarRoute.vue')
// Charts
const Charts = () => import('src/pages/Dashboard/Charts.vue')
// import Charts from 'src/pages/Dashboard/Charts.vue'


import VueRouter from 'vue-router'

let elmanagement = {
  path: '/equipmentLedgerManagement',
  component: DashboardLayout,
  redirect: '/equipmentLedgerManagement/equipmentAccountInquiry',
  children: [
    {
      path: 'equipmentAccountInquiry',
      name: 'EquipmentAccountInquiry',
      component: EquipmentAccountInquiry
    }, {
      path: 'functionalLocationManagement',
      name: 'FunctionalLocationManagement',
      component: FunctionalLocationManagement
    }, {
      path: 'newEquipmentAssets',
      name: 'NewEquipmentAssets',
      component: NewEquipmentAssets
    }, {
      path: 'changeEquipmentAssets',
      name: 'ChangeEquipmentAssets',
      component: ChangeEquipmentAssets
    },
  ]
}
let componentsMenu = {
  path: '/components',
  component: DashboardLayout,
  redirect: '/components/buttons',
  children: [
    {
      path: 'buttons',
      name: 'Buttons',
      component: Buttons
    }, {
      path: 'grid-system',
      name: 'Grid System',
      component: GridSystem
    }, {
      path: 'panels',
      name: 'Panels',
      component: Panels
    }, {
      path: 'sweet-alert',
      name: 'Sweet Alert',
      component: SweetAlert
    }, {
      path: 'notifications',
      name: 'Notifications',
      component: Notifications
    }, {
      path: 'icons',
      name: 'Icons',
      component: Icons
    }, {
      path: 'typography',
      name: 'Typography',
      component: Typography
    }
  ]
}
let formsMenu = {
  path: '/forms',
  component: DashboardLayout,
  redirect: '/forms/regular',
  children: [
    {
      path: 'regular',
      name: 'Regular Forms',
      component: RegularForms
    }, {
      path: 'extended',
      name: 'Extended Forms',
      component: ExtendedForms
    }, {
      path: 'validation',
      name: 'Validation Forms',
      component: ValidationForms
    }, {
      path: 'wizard',
      name: 'Wizard',
      component: Wizard
    }
  ]
}
let tablesMenu = {
  path: '/table-list',
  component: DashboardLayout,
  redirect: '/table-list/regular',
  children: [
    {
      path: 'regular',
      name: 'Regular Tables',
      component: RegularTables
    }, {
      path: 'extended',
      name: 'Extended Tables',
      component: ExtendedTables
    }, {
      path: 'paginated',
      name: 'Paginated Tables',
      component: PaginatedTables
    }
  ]
}
let mapsMenu = {
  path: '/maps',
  component: DashboardLayout,
  redirect: '/maps/google',
  children: [
    {
      path: 'google',
      name: 'Google Maps',
      component: GoogleMaps
    }, {
      path: 'full-screen',
      name: 'Full Screen Map',
      component: FullScreenMap
    }, {
      path: 'vector-map',
      name: 'Vector Map',
      component: VectorMaps
    }
  ]
}
let pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  redirect: '/pages/user',
  children: [
    {
      path: 'user',
      name: 'User Page',
      component: User
    }, {
      path: 'timeline',
      name: 'Timeline Page',
      component: TimeLine
    }
  ]
}
let loginPage = {
  path: '/login',
  name: 'Login',
  component: Login
}
let registerPage = {
  path: '/register',
  name: 'Register',
  component: Register
}
let lockPage = {
  path: '/lock',
  name: 'Lock',
  component: Lock
}
let modifypswPage = {
  path: '/modifypsw',
  name: 'Modifypsw',
  component: Modifypsw,
}
let staff = {
  path: '/Staff',
  component: DashboardLayout,
  redirect: '/Staff/staffmanage',
  children: [
    {
      path: 'Staffmanage',
      name: 'staffmanage',
      component: Staffmanage,
    }, {
      path: 'Departmentmanage',
      name: 'departmentmanage',
      component: Departmentmanage
    }
  ]
}

//八斗工具
let bdtool = {
  path:'/bdtool',
  component: DashboardLayout,
  redirect: '/bdtool',
  children:[
    {
      path:'bdIconlibrary',
      name: 'BdIconlibrary',
      component:BdIconlibrary,
    },
    {
      path:'bdIconFontsome',
      name: 'BdIconFontsome',
      component:BdIconFontsome,
    },
    {
      path:'menuPermission',
      name:'MenuPermission',
      component:MenuPermission
    }
  ]
}


let test = {
  path: '/test',
  component: DashboardLayout,
  children: [
    {path: 'test1', component: resolve => require(['src/pages/Test/Tset1.vue'], resolve)},
    {path: 'test2', component: resolve => require(['src/pages/Test/second/Tset2.vue'], resolve)},
    {path: 'test3', component: resolve => require(['src/pages/Test/second/Tset3.vue'], resolve)},
    {path: 'test4', component: resolve => require(['src/pages/Test/second/Tset4.vue'], resolve)},
    {path: 'test5', component: resolve => require(['src/pages/Test/second/Tset5.vue'], resolve)},
    {path: 'test6', component: resolve => require(['src/pages/Test/second/Tset6.vue'], resolve)},
    {path: 'test7', component: resolve => require(['src/pages/Test/second/Tset7.vue'], resolve)},
    {path: 'searchbar', component: resolve => require(['src/pages/Dashboard/Layout/Extra/SearchBar.vue'], resolve)},
    {path: 'searchbar2', component: resolve => require(['src/components/search/SearchBar.vue'], resolve)},
    {path: 'tree', component: resolve => require(['src/view/module/tree/list.vue'], resolve)},
    {path: 'filter', component: resolve => require(['src/components/search/filter/filter.vue'], resolve)},
  ]
}

import PermissionUtils from 'src/js/PermissionUtils.js'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  test,
  elmanagement,
  /*指代上述模块*/
  componentsMenu,
  formsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  loginPage,
  registerPage,
  lockPage,
  modifypswPage,
  staff,
  bdtool,
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      }, {
        path: 'stats',
        name: 'Stats',
        component: Stats
      }, {
        path: 'calendar',
        name: 'Calendar',
        component: Calendar
      }, {
        path: 'charts',
        name: 'Charts',
        component: Charts
      }
    ]
  },
  {path: '*', component: NotFound}
]

const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => { //to:即将前往的页面,from:从哪个页面来,next:下一步操作
  let token = sessionStorage.getItem('token');
  if (token && !PermissionUtils.isLoad()) {
    PermissionUtils.dynamicRoute(() => {
      next({ ...to, replace: true })
    })
  } else {
    next()
  }
})

export default router
