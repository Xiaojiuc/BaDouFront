<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="60%"
    append-to-body
    class="scorpion">
    <div class="dialog-customize-content">
      <div class="tree-block">
        <p>菜单</p>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="dialog-transfer">
        <div style="margin-bottom: 20px;">
          <el-input placeholder="请输入内容"  class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <el-transfer v-model="value1" :data="transdata"></el-transfer>
        <div style="margin-top:10px;">
          描述
        </div>
      </div>
    </div>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import $ from 'jquery'
  import { Dialog,Dropdown,DropdownMenu,DropdownItem,Popover,Tree,Transfer } from 'element-ui'
  export default {
    components: {
      [Dialog.name]:Dialog,
      [Dropdown.name]:Dropdown,
      [DropdownMenu.name]:DropdownMenu,
      [DropdownItem.name]:DropdownItem,
      [Popover.name]:Popover,
      [Tree.name]:Tree,
      [Transfer.name]:Transfer
    },

    data () {

      const generateData = _ => { //树形菜单数据渲染
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            // disabled: i % 4 === 0 //i除于4被禁止选择
          });
        }
        return data;
      };

      return {
        transdata:generateData(), //穿梭框数据渲染
        value1: [1, 0], //右边默认显示
        dialogVisible:false, //对话框显示控制
        dialogTitle:'我的地址本', //对话框标题
        data: [{ //树形菜单渲染数据示例
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      openDialog:function(){ //父组件打开对话框调用方法
        this.dialogVisible=true;
      },
       handleNodeClick(data) {
        console.log(data);
      }
    },
    created() {
      
    }
  }
</script>
<style>
  .dialog-customize-content{
    padding: 0 25px 25px 25px;
    display: flex;
    width: 100%;
  }
  .tree-block{
    width: 30%;
    display: inline-block;
    border:1px solid #efecec;
  }
  .tree-block p{
    width: 100%;
    height: 35px;
    font-size: 16px;
    text-align: center;
    background-color: #409EFF;
    color:white;
    border:1px solid #efecec;
    margin-bottom: 5px;
    padding-top: 4px;
  }
  .dialog-transfer{
    width: 68%;
    display: inline-block;
    margin-left: 1%;
    position: relative;
  }
  .dialog-transfer .el-transfer-panel{
    width: 42%;
  }
  .dialog-transfer .el-checkbox{
    display: block;
  }
  .dialog-transfer .el-transfer__button:nth-child(2){
    margin: 0 auto;
  }
  .dialog-transfer .el-transfer__buttons{
    width: 16%;
  }
  .scorpion .el-dialog__footer{
    text-align: center;
  }
  .scorpion .el-dialog__footer .el-button{
    padding:15px 25px;
  }
</style>
