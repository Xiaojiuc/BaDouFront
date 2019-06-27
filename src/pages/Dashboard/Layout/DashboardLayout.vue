<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <side-bar :sidebar-links="menus">
      <user-menu></user-menu>
      <mobile-menu></mobile-menu>
      <template slot-scope="props" slot="links"></template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <!-- 暂时屏蔽footer内容 -->
      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './Extra/MobileMenu.vue'
  import UserMenu from './Extra/UserMenu.vue'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
      UserMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    computed: {
      menus () {
        let arr = this.$store.getters['permission/menus']
        if (arr && arr.length > 0) {
          return arr.filter(m => m.code !== 'PERSONAL')
        }
        return arr
      }
    }
  }

</script>
<style lang="scss">
  .vue-notifyjs.notifications {
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }

  .sidebar .nav .nav-item .nav-link  .sidebar-mini-tip{
    opacity: 0 !important;
  }

  .sidebar-mini .hideIcon {
    display: none;
  }
  .sidebar:hover .hideIcon{
    display: block;
  }


  .nav-item .icon {
    display: inline-block;
    font: normal normal normal 14px/1 'nucleo-icons';
    speak: none;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 28px;
    margin-right: 15px;
    width: 30px;
    text-align: center;
    vertical-align: middle;
    float: left;
    height: 0.9em;
  }
</style>
