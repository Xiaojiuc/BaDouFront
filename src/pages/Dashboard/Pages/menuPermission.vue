<template>
  <div class="row">
    <div id="menuTree" class="col-2" v-if="hackReset">
      <p  class="tree-title">{{module.name}}
        <i @click="hideMenu" class="fa fa-angle-double-left"></i>
      </p>
        <el-tree
          ref="tree"
          :props="props1"
          :load="loadNode"
          :default-expanded-keys="defaultExpandedKeys"
          lazy
          :expand-on-click-node="false"
          @node-expand="nodeExpand"
          @node-collapse="nodeClose"
          @node-click="nodeClick">
            <span slot-scope="{ node, props1 }">
            <span><i :id="node.id" :class="node.isLeaf ? 'last-node fa  fa-list-alt' : 'folder fa  fa-folder'"></i></span>
            <span>{{node.label}}</span>
          </span>
        </el-tree>
      </div>
      <div class="spread" v-if="!hackReset">
        <i @click="showMenu" class="fa fa-angle-double-right"></i>
      </div>


    <div class="col-10">
      <p class="role-title">当前角色: [八斗开发,SUPER]</p>
      <el-tree
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
        :expand-on-click-node="false"
        @node-expand="nodeExpand"
        @node-collapse="nodeClose"
        @check-change="handleCheckChange">
        <span slot-scope="{ node, props1 }">
            <span><i :id="node.id" :class="node.isLeaf ? 'last-node fa  fa-list-alt' : 'folder fa  fa-folder'"></i></span>
            <span>{{node.label}}</span>
          </span>
      </el-tree>
       <button class="save-btn">保存菜单</button>
    </div>
   
  </div>
</template>
<script>
  import {Tree} from 'element-ui';
  import AuthLayout from './AuthLayout.vue'

  export default {
    components: {
      [Tree.name]: Tree,
      AuthLayout
    },
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1
      };
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      },
      nodeExpand(data){ //节点展开时图标替换
        document.getElementById(data.$treeNodeId).classList.remove('fa-folder')
        document.getElementById(data.$treeNodeId).classList.add('fa-folder-open')
      },
      nodeClose(data){ //节点关闭时图标替换
        document.getElementById(data.$treeNodeId).classList.remove('fa-folder-open')
        document.getElementById(data.$treeNodeId).classList.add('fa-folder')
      },
      hideMenu(){ //隐藏树形菜单
        this.hackReset=false
        var menu=document.getElementById('menuTree')
        menu.style.display='none'
      },
      showMenu(){ //隐藏树形菜单
        this.hackReset=true
        var menu=document.getElementById('menuTree')
        menu.style.display='block'
      }
    }
  };
</script>

<style scoped>
  .col-10{
    background-color: white;
    padding:1% 0;
  }
  .save-btn{
    background-color: #87b880;
    color:white;
    height: 35px;
    border:none;
    outline: none;
    font-size: 14px;
    width:fit-content;
    padding: 0 10px;
    margin-left: 92%;
  }
  .folder{
    color:#2684ce;
  }
  .last-node{
    color:#69a946;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: #d5d8db;
  }
  .el-tree-node__content>.el-checkbox{
    margin-bottom: 2px;
  }
  .role-title{
    padding-left: 15px;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5
  }
  .last-node{
    color:#69a946;
  }
  .tree-title{
    margin: 0;
    background-color: #def2ff;
    padding:2% 0px 2% 8px;
    color:#183152;
    font-size: 14px;
  }
  .tree-title i{
    float: right;
    font-size: 20px;
    margin-right: 5px;
  }
  .spread{
    display: inline-block;
    background-color: #EAF2FE;
    border:1px solid #B8D0D6;
    width: fit-content;
    height: 500px;
    font-size: 20px;
    margin-right:30px;
  }

</style>
