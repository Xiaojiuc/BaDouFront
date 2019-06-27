<template>
  <div class="sidebar"
       :style="sidebarStyle"
       :data-color="backgroundColor"
       :data-image="backgroundImage"
       :data-active-color="activeColor">

    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <div class="logo">
        <!-- <a class="logo-mini"
           href="https://www.creative-tim.com/product/vue-light-bootstrap-dashboard-pro">
          <div class="logo-img">
              <img :src="logo" alt="logo">
          </div>
        </a> -->
        <a class="simple-text logo-normal" href="javascript:void(0)" @click="goHomePage">
          {{systemTitle}}
        </a>
      </div>
      <slot>

      </slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in sidebarLinks"
                        :key="link.name + index"
                        :link="link"
                        :level="1"
          >

            <sidebar-item v-for="(secondLink, index) in link.children"
                          :key="secondLink.name + index"
                          :link="secondLink"
                          :level="2"
            >

              <sidebar-item v-for="(thirdLink, index) in secondLink.children"
                            :key="thirdLink.name + index"
                            :link="thirdLink"
                            :level="3"
              >
              </sidebar-item>

            </sidebar-item>

          </sidebar-item>
        </slot>

      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sidebar',
    props: {
      backgroundImage: {
        type: String,
        default: 'static/img/sidebar-5.png'
      },
      activeColor: {
        type: String,
        default: 'success',
        validator: (value) => {
          let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      logo: {
        type: String,
        default: 'static/img/vue-logo.png'
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        systemTitle: '',
        backgroundColor: '#4477d0'
      }
    },
    provide () {
      return {
        autoClose: this.autoClose
      }
    },
    computed: {
      sidebarStyle () {
        return {
          // backgroundImage: `url(${this.backgroundImage})`
          backgroundColor: this.backgroundColor
        }
      }
    },
    methods: {
      async initScrollBarAsync () {
        await import('perfect-scrollbar/dist/css/perfect-scrollbar.css')
        const PerfectScroll = await import('perfect-scrollbar')
        PerfectScroll.initialize(this.$refs.sidebarScrollArea)
      },
      // 跳转首页
      goHomePage() {
        this.$router.push({name: 'Overview'})
      }
    },
    mounted () {
      this.initScrollBarAsync()
    },
    beforeDestroy () {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false
      }
    },
    created: function () {
      this.post(this.INTERFACE.findSystemInfo, {}, (isSuccess, res) => {
        if (isSuccess) {
          if (res.systemTitle) this.systemTitle = res.systemTitle
          if (res.menucolor) this.backgroundColor = res.menucolor
        }
      }, true)
    }
  }

</script>
<style>
  .logo-normal {
    text-align: center;
    font-weight: 700 !important;
  }

  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu{
      display: none;
    }
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"]~div .nav .nav-item:hover .nav-link{
    background: none !important;
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"]~div .nav .nav-item .nav-link:hover {
    background: rgba(255, 255, 255, 0.13);
  }
</style>
