<template>
  <div>
    <card>
      <button v-for='btn in buttons' v-if="!btn.isHide" @click='exeMethod(btn.id)' class='btn btn-primary'><i
        :class="btn.icon"></i>{{ btn.name }}
      </button>
    </card>

    <!-- v-if="module.id" 存在module时才去加载数据 -->
    <el-tree
      :data="permissionDatas"
      ref="perTree"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps">
      <span slot-scope="{ node, props2 }">
          <span><i :id="node.id" :class="node.isLeaf ? 'last-node fa  fa-list-alt' : 'folder fa  fa-folder'"></i></span>
          <span>{{node.label}}</span>
      </span>
    </el-tree>

  </div>
</template>

<script>
  import {Tree} from 'element-ui'

  export default {
    name: 'permission_tree',
    components: {
      [Tree.name]: Tree,
    },
    props: {
      module: {
        type: Object,
        default() {
          return {
            id: '',
            code: '',
            name: '',
            moduleDisplay: [],
            listJs: '',
            listJsObj: {},
            selectorData: [],
            searchCondition: [],
          }
        }
      },
      defaultButtons: {
        type: Array
      }
    },
    data() {
      return {
        queryParams: {},
        searchParam: '',
        buttons: [],
        permissionDatas: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkedKeys: [],
        props1: {
          label: 'name',
          isLeaf(data) {
            return !(data.isParent || data.hasChild)
          }
        },
      }
    },
    computed: {
      url() {
        return `${this.BASEURL}/auth/assign/roleresourceassignmenu/tree.do`
      },
      btnMethod() {
        let obj = {}
        this.buttons.forEach(btn => obj[btn.id] = btn.click)
        return obj
      },
    },
    methods: {
      getCheckedNodeKeys() {
        return this.$refs.perTree.getCheckedKeys().join(',')
      },
      exeMethod(method) {
        this.btnMethod[method].call(this)
      },
      randerBtn(newButtons) {
        // 获取默认按钮
        let btns = Object.assign([], this.defaultButtons)
        this.buttons = btns
      },
      refresh () {
        this.checkedKeys = []
        let params = {
          "roleId": this.queryParams.parentId ? this.queryParams.parentId : this.$route.query.roleId ? this.$route.query.roleId :'ROOT'
        }
        this.post(this.url, params, (isSuccess, res) => {
          if (isSuccess) {
            this.permissionDatas = res
            this.permissionDatas.forEach(t => {this.setCheckedTree(t)});
            this.$refs.perTree.setCheckedKeys(this.checkedKeys);
            /*
             * 如果获取到的数据为空，并且当前页面不是第一页时，加载上一页的数据
             * 删除当前页所有记录的时候会出现这个情况
             */
            if (this.permissionDatas.length === 0) {
              this.refresh()
            }
          }
        }, true)
      },
      setCheckedTree (data) {
        if (data.ischecked) {
          this.checkedKeys.push(data.id)
        }
        if (data.children.length > 0) {
          data.children.forEach(tt => this.setCheckedTree(tt));
        }
      },
      reset() {
        this.refresh()
      },
      updateQueryParam(key, value) {
        this.queryParams[key] = value
      },
      removeQueryParam(key) {
        delete this.queryParams[key]
      },
      resetQueryParam() {
        this.queryParams = {}
      }
    },
    watch: {
      module: {
        deep: true,
        handler: function () {
          this.randerBtn(this.module.listJsObj.buttons)
          if (this.$refs.list)
            Promise.resolve().then(this.$refs.list.reset)
        }
      }
    },
    created () {
      this.refresh()
    }
  }
</script>

<style scoped>
  .card {
    margin-bottom: 10px;
  }
  .card-body button {
    margin-right: 10px;
  }
  .tree {
    padding-left: 16px;
    width: 270px;
  }
  .folder {
    color: #2684ce;
  }

  .last-node {
    color: #69a946;
  }
  .el-tree {
    min-height: calc(100vh * 0.3);
    max-height: calc(100vh * 0.7);
    overflow: scroll;
    border-radius: 0px 0px 4px 4px;
    border-left: 1px solid rgba(0, 0, 0, 0.125);
    border-right: 1px solid rgba(0, 0, 0, 0.125);
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    font-size: 14px;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #d5d8db;
  }
</style>
