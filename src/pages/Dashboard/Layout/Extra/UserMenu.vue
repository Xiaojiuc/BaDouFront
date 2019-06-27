<template>
  <div class="user">
    <div class="photo">
      <img :src="headImg" alt="avatar"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.stop="toggleMenu">
           <span>
             {{title}}
          </span>
      </a>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
  import PermissionUtils from 'src/js/PermissionUtils.js'

  export default {
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    data () {
      return {
        isClosed: true,
      }
    },
    computed: {
      title () {
        return this.$store.getters['user/info'].name
      },
      headImg () {
        let img = this.$store.getters['user/info'].headImg
        if (img) {
          return `${this.INTERFACE.downloadAttach}?attachId=${img}`
        }
        return 'static/img/faces/face-0.jpg'
      },
    },
    methods: {
      toggleMenu () {
        this.isClosed = !this.isClosed
      }
    },
    created: function () {
      if (this.title) {
        return
      }
      this.get(this.INTERFACE.userInfo, {}, (isSuccess, res) => {
        if (isSuccess) {
          this.$store.commit('user/save', res)
        }
      }, true)
    }
  }
</script>
<style>
  .collapsed {
    transition: opacity 1s;
  }
</style>
