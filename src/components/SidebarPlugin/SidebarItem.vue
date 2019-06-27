<template>
  <component :is="baseComponent"
             :to="link.path ? link.path : '/'"
             class="nav-item"
             :class="{active : isActive}"
             tag="li">

    <a v-if="isMenu"
       class="nav-link sidebar-menu-item"
       :class="{'second-menu' : level === 2, 'third-menu' : level === 3}"
       :aria-expanded="!collapsed"
       data-toggle="collapse"
       @click="collapseMenu">

      <i :class="link.icon"></i>
      <p>
        {{link.name}}
        <b class="caret"></b>
      </p>

    </a>
    <div v-if="$slots.default || this.isMenu">
      <el-collapse-transition>
        <ul class="nav"
            :class="{'hideIcon' : level === 1 || level === 2}"
            v-show="!collapsed">
          <slot></slot>
        </ul>
      </el-collapse-transition>
    </div>

    <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
      <component
        :to="{path: link.path, query: link.query}"
        @click.native="linkClick"
        :is="elementType(link, false)"
        :class="{active: link.active, 'second-menu' : level === 2, 'third-menu' : level === 3}"
        class="nav-link"
        :target="link.target"
        :href="link.path">
        <template v-if="addLink">
          <i v-if="level !== 3" :class="link.icon"></i>
          <p class="">
            {{link.name}}
          </p>
        </template>
        <template v-else>
          <i :class="link.icon"></i>
          <p>{{link.name}}</p>
        </template>
      </component>
    </slot>
  </component>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

  export default {
    name: 'sidebar-item',
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    props: {
      menu: {
        type: Boolean,
        default: false
      },
      link: {
        type: Object,
        default: () => {
          return {
            name: '',
            path: '',
            children: []
          }
        }
      },
      level: {
        type: Number,
        default: () => 1
      }
    },
    provide () {
      return {
        addLink: this.addChild,
        removeLink: this.removeChild
      }
    },
    inject: {
      addLink: {default: null},
      removeLink: {default: null},
      autoClose: {
        default: true
      }
    },
    data () {
      return {
        children: [],
        collapsed: true
      }
    },
    computed: {
      baseComponent () {
        return this.isMenu || this.link.isRoute ? 'li' : 'router-link'
      },
      isMenu () {
        return this.children.length > 0 || this.menu === true
      },
      isActive () {
        if (!this.$route || !this.$route.path) {
          return false
        }

        let thirdMenu = []
        // 匹配二级菜单
        for (let key in this.children) {
          let c = this.children[key]
          if (this.$route.path.startsWith(c.link.path)) {
            // 如果二级菜单匹配到当前url，直接返回
            return true;
          }
          // 添加三级菜单到数组中，后面进行查询
          c.children.forEach(e => thirdMenu.push(e))
        }

        // 匹配3级菜单
        let matchingRoute = thirdMenu.find((c) => this.$route.path.startsWith(c.link.path))
        return matchingRoute !== undefined
      }
    },
    methods: {
      addChild (item) {
        const index = this.$slots.default.indexOf(item.$vnode)
        this.children.splice(index, 0, item)
      },
      removeChild (item) {
        const tabs = this.children
        const index = tabs.indexOf(item)
        tabs.splice(index, 1)
      },
      elementType (link, isParent = true) {
        if (link.isRoute === false) {
          return isParent ? 'li' : 'a'
        } else {
          return 'router-link'
        }
      },
      linkAbbreviation (name) {
        const matches = name.match(/\b(\w)/g)
        return matches.join('')
      },
      linkClick () {
        if (this.autoClose && this.$sidebar && this.$sidebar.showSidebar === true) {
          this.$sidebar.displaySidebar(false)
        }
      },
      collapseMenu () {
        this.collapsed = !this.collapsed
      },
      collapseSubMenu (link) {
        link.collapsed = !link.collapsed
      }
    },
    mounted () {
      if (this.addLink) {
        this.addLink(this)
      }
      if (this.link.collapsed !== undefined) {
        this.collapsed = this.link.collapsed
      }
      if (this.isActive && this.isMenu) {
        this.collapsed = false
      }
    },
    destroyed () {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
      if (this.removeLink) {
        this.removeLink(this)
      }
    }
  }
</script>
<style>
  .sidebar-menu-item{
    cursor: pointer;
  }
  .second-menu {
    padding-left: 25px !important;
  }

  .third-menu {
    padding-left: 55px !important;
  }

  .sidebar .nav .nav-item .nav-link i {
    font-size: 16px !important;
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"] ~ div .nav .nav-item .nav-link {
    font-size: 12px;
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"] ~ div .nav .nav-item.active .nav-link {
    background: none !important;
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"] ~ div .nav .nav-item.active > .nav-link {
    background: rgba(255, 255, 255, 0.13) !important;
  }

  .sidebar .sidebar-wrapper .nav .nav-item [data-toggle="collapse"] ~ div .nav .nav-item  > .nav-link:hover {
    background: rgba(255, 255, 255, 0.13) !important;
  }
</style>
