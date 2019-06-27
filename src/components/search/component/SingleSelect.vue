<!--
  下拉单选框
  JSON 配置格式：{"id":"typeText", "name":"类型", "selectType":9, "valueText":"全部", "isExtended":false}
-->
<template>
  <div class="search-value">
    <span>{{selector.name}}:</span>
    <el-dropdown>
      <el-button type="primary">
        {{valueText}} <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in selector.searchCondition"
          :key="item.id"
          @click.native="clickItem(item)"
        >{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {Dropdown, DropdownMenu, DropdownItem} from 'element-ui'

  export default {
    name: "s-single-select",
    components: {
      [Dropdown.name]:Dropdown,
      [DropdownMenu.name]:DropdownMenu,
      [DropdownItem.name]:DropdownItem,
    },
    props: {
      selector: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        value: {}
      }
    },
    computed: {
      valueText () {
        return this.value.text || '全部'
      }
    },
    methods: {
      clickItem (item) {
        this.value = item
        this.$emit('change')
      },
      getSelectorValue () {
        if (this.value.id) {
          return {name: this.selector.id, type: 'exact-match', value: this.value.id}
        }
      },
      reset () {
        this.value = {}
      },
      setValue (value) {
        if (!value) {
          this.value = {}
          return
        }

        let condition = this.selector.searchCondition
        if (!condition)
          return

        for (let i in condition) {
          if (condition[i].id == value) {
            this.value = condition[i]
          }
        }
      },
      getSelectorInfo () {
        return this.selector
      }
    }
  }
</script>

<style scoped>

</style>
