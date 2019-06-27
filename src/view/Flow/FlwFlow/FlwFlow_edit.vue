<template>
  <div>
    <location>
        <i class="fa fa-map-marker"></i> {{module.name}} - 编辑
    </location>
    <div class="row" @resize="resizeList">
      <div class="tree" v-show="!hideTree">
        <p class="tree-title">{{module.name}}
        <i @click="hideMenu" class="fa fa-angle-double-left"></i>
        </p>
        <el-tree
          ref="tree"
          :props="props1"
          :data="treeDatas"
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
          :default-expand-all="expandAll()"
          @node-click="nodeClick">
          <span slot-scope="{ node, props1 }">
            <span class="flow-icon">
                <i :id="node.id"
                :class="node.level === 1 ? 'fa fa-square' : node.level === 2 ? 'fa fa-circle' : 'fa fa-dot-circle-o'">
                </i>
            </span>
          <span>{{node.label}}</span>
        </span>
        </el-tree>
      </div>
      <div class="spread" v-show="hideTree">
        <i @click="showMenu" class="fa fa-angle-double-right"></i>
      </div>

      <div :class="{'list1': !hideTree, 'list2': hideTree}">
        <flwflow-edit
            :module="module"
            ref="flowEdit"
            v-if="hackReset"
            :defaultButtons="defaultButtons">
        </flwflow-edit>
      </div>
    </div>

    <!-- 选择流程视图时的弹窗 -->
    <el-dialog
    :title="config.title"
    :visible.sync="config.dialogVisible"
    width="30%"
	>
		<el-table :data="gridData" ref="viewList" @row-click="viewRowClick" @selection-change="selectData = $event">
			<el-table-column
			type="selection"
			width="55">
			</el-table-column>
			<el-table-column v-for="column in columns" :key="column.name" row-key="id" :property="column.name" :label="column.displayName" width="150"></el-table-column>
		</el-table>

		<span slot="footer" class="dialog-footer">
			<el-button @click="config.dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="setViewInfo">确 定</el-button>
		</span>
    </el-dialog>

  </div>
</template>

<script>
  import PermissionUtils from 'src/js/PermissionUtils.js'
  import FlwFlowEdit from './FlwFlowEdit'
  import {Tree, Dialog} from 'element-ui'
  import {Location} from 'src/components/index'
  import ModuleUtils from 'src/js/ModuleUtils'

  let addNodeBtn = 
  {
        id: 'addNode',
        name: '新增环节',
        priority: 10,
        isHide: false,
        icon: 'icon iconfont bd-save-o',
        click: function () {
            // 如果点击的不是第一级，则不处理
            if (!this.$parent.$refs.tree.getCurrentKey() || this.$parent.currentNodeLevel !== 1) {
                this.alert('请选择流程定义!', 'warning')
                return
            }
            let node = this.$parent.$refs.tree.getNode(this.$parent.$refs.tree.getCurrentKey())
            this.$parent.currentNodeId = 'ROOT'
            this.$parent.setNodeModuleInfo(node, true)
        }
  }
  let addRouteBtn = 
  {
        id: 'addRoute',
        name: '新增路由',
        priority: 20,
        isHide: false,
        icon: 'icon iconfont bd-save-o',
        click: function () {
            if (!this.$parent.$refs.tree.getCurrentKey() || this.$parent.currentNodeLevel !== 2) {
                this.alert('请选择流程环节!', 'warning')
                return
            }
            let node = this.$parent.$refs.tree.getNode(this.$parent.$refs.tree.getCurrentKey())
            if (node.data.flgRoot === '1') {
                this.alert('结束环节不能添加路由!', 'warning')
                return
            }
            this.$parent.currentNodeId = 'ROOT'
            this.$parent.setRouteModuleInfo(node, true)
        }
  }
  let deleteBtn = 
  {
        id: 'delete',
        name: '删除',
        priority: 30,
        isHide: false,
        icon: 'icon iconfont bd-trash-alt-o',
        click: function () {
              let tarNode = this.$parent.$refs.tree.getCurrentNode()
              if (!tarNode) {
                  this.alert('请选择节点', 'warning')
                  return
              }
              if (this.$parent.currentNodeLevel === 1) {
                  this.alert('请选择其他节点删除！', 'warning')
                  return
              }
              this.$confirm('确定删除吗？', '删除', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  let params = {
                      mdCode: this.module.code,
                      ids: tarNode.id
                  }
                  this.post(`${this.BASEURL}/jdbc/common/basecommondelete/delete.do`, params, (isSuccess, res) => {
                      if (res.hasOk) {
                          /* 移除树节点 */
                          this.$parent.$refs.tree.remove(tarNode)
                          /* 取消当前选择节点状态 */
                          this.$parent.$refs.tree.setCurrentKey(null)
                      } else {
                          this.alert('删除失败', 'error')
                      }
                  }, true)
              }).catch(() => {})
        }
  }
  let default_btn = [
    {
        id: 'save',
        name: '保存',
        icon: 'icon iconfont bd-save-o',
        priority: 1,
        isHide: false,
        click: function () {
            let _this = this;
            this.$refs.mainForm.validate(function () {
                let url = `${_this.BASEURL}/jdbc/common/basecommonsave/saveIncludeFile.do?mdCode=${_this.module.code}`
                if (_this.module.code === _this.$parent.nodeMdCode) {
                    url = `${_this.BASEURL}/engine/flow/action/nodenew/saveNode.do`
                } else if (_this.module.code === _this.$parent.routeMdCode) {
                    url = `${_this.BASEURL}/engine/flow/action/routenew/saveRoute.do`
                    let nodeIds = []
                    nodeIds.push(_this.$refs.mainForm.dataModel['nextNodeId'])
                    _this.$refs.mainForm.nodeItems.forEach(n => {
                        nodeIds.push(n['nextNodeId'])
                    })
                    _this.$refs.mainForm.dataModel['nextNodeIds'] = nodeIds.join(',')
                }
                _this.postFile(url, _this.$refs.mainForm.dataModel, (isSuccess, res) => {
                    if (res.hasOk) {
                        _this.alert('保存成功', 'success')
                        _this.$parent.currentNodeId = res.bean.id
                        let data = {}
                        if (_this.module.code === _this.$parent.nodeMdCode || _this.module.code === _this.$parent.routeMdCode) {
                            data = Object.assign({}, res.bean)
                        } else {
                            for (let key in res.bean.details) {
                                data[key] = res.bean.details[key][0]
                            }
                            data.id = res.bean.id
                        }
                        // 新增
                        if (res.save) {
                            /*如果是流程定义新增，则替换节点即可*/
                            if (_this.module.code === _this.$parent.flowMdCode) {
                                /*设置当前路由参数传过来的id*/
                                _this.$parent.$route.params.id = data.id
                                _this.$parent.treeDatas = [data]
                                /*默认新增一个结束的环节*/
                                let url = `${_this.BASEURL}/jdbc/common/basecommonsave/save.do?mdCode=${_this.$parent.nodeMdCode}`
                                let endNodeForm = Object.assign({}, _this.$parent.endNode)
                                endNodeForm.flowId = data.id
                                endNodeForm.busiId = data.busiType
                                _this.post(url, endNodeForm, (isSuccess, res) => {
                                    _this.$parent.loadNode()
                                    console.info('create end node success')
                                },true)
                                /*往FLW_MONITOR表中添加一条关联记录，虽然不知道干嘛用的，不加的话，旧版本流程定义页面编辑页报错*/
                                /*TODO*/
                                url = `${_this.BASEURL}/jdbc/common/basecommonsave/save.do?mdCode=${_this.$parent.monitorMdCode}`
                                endNodeForm = {'flowId': data.id}
                                _this.post(url, endNodeForm, (isSuccess, res) => {
                                    console.info('create monitor success')
                                },true)
                                /*重新渲染编辑数据，否则继续点保存会新增而不是更新*/
                                _this.$refs.mainForm.editJSON()
                                return
                            }
                            /*插入节点到树*/
                            let needFlushNode = _this.$parent.$refs.tree.getNode(_this.$parent.$refs.tree.getCurrentKey())
                            if (needFlushNode.childNodes.length > 0 && _this.module.code === _this.$parent.nodeMdCode) {
                                _this.$parent.$refs.tree.insertBefore(data, needFlushNode.childNodes[needFlushNode.childNodes.length - 1])
                            } else {
                                _this.$parent.$refs.tree.append(data, needFlushNode)  
                            }
                            /* 设置新增的节点为选中状态 */
                            _this.$parent.$refs.tree.setCurrentKey(data.id)
                            /*重新渲染编辑数据，否则继续点保存会新增而不是更新*/
                            _this.$refs.mainForm.editJSON()
                            /* 添加新增按钮 */
                            _this.$set(_this.buttons, _this.buttons.length, Object.assign({}, _this.$parent.deleteBtn))
                            _this.btnSort()
                        }
                        // _this.$parent.nodeClick(needFlushNode, needFlushNode.data)
                        // _this.$refs.mainForm.editJSON()
                    } else {
                        _this.alert(`保存失败！${res.message}`)
                    }
                }, true)
            });
        }
    }, {
        id: 'close',
        name: '关闭',
        priority: 100,
        icon: 'icon iconfont bd-times',
        click: function () {
            this.$parent.close()
        }
    }
  ]

  export default {
    components: {
      [FlwFlowEdit.name]: FlwFlowEdit,
	  [Tree.name]: Tree,
	  [Dialog.name]: Dialog,
      Location,
    },
    data() {
      return {
        busiId: null,   /* 流程业务id */
		/* 视图的列表数据 */
		gridData: [],
		/* 视图的列表列 */
		columns: [
			{
				name: 'name',
				displayName: '名称'
			},
			{
				name: 'remark',
				displayName: '说明'
			}
		],
        treeDatas: [],
        hideTree: false,
        hackReset: false,
        props1: {
          label: 'name',
          isLeaf(data) {
            return !(data.isParent || data.hasChild)
          }
        },
        selectParams: {}, /*编辑页选择框的请求数据参数*/
        /*结束环节，创建流程定义的时候自动创建一个结束环节*/
        endNode: {
            automaticTerminate: 0,
            busiId: null,
            flgAllowDelete: 0,
            flgAllowModify: 0,
            flgDeleted: 0,
            flgHead: 0,
            flgPrevOver: 0,
            flgRoot: 1,
            flgSpread: 0,
            flgSpreadAllow: 1,
            flgSubmitSync: 1,
            flowId: null,
            gradeScale: 100,
            name: '结束',
            nodeHandlerScope: 20,
            nodeHandlerType: 20,
            priority: 100,
            windowType: 0
        },
        /*流程定义模型mdCode*/
        flowMdCode: 'flwFlow',
        /*环节模型mdCode*/
        nodeMdCode: 'FlwNode',
        /*路由模型mdCode*/
        routeMdCode: 'FlwRoute',
        /*flw_monitor表模型mdCode，后期不需要了可以删掉*/
        monitorMdCode: 'FlwMonitor',
        /*流程处理人子表模型comm_handler_instance*/
        handlerMdCode: 'HandlerInstance',
        module: {
            id: '',
            code: '',
            name: '',
            fields: [],
            dic: {},
            editedJs: '',
            editedJsObj: {}
		},
        defaultSearchParam: [],
        queryParams: {},
        sortname: '',
        sortorder: '',
        customDefaultParams: {},
        defaultButtons: default_btn,
        nodeBtn: addNodeBtn,      /*添加环节按钮*/
        routeBtn: addRouteBtn,    /*添加路由按钮*/
        deleteBtn: deleteBtn,     /*删除按钮*/
        defaultExpandedKeys: [],  /*默认展开的树节点*/
        currentNodeId: 'ROOT',    /*默认加载列表的树节点id*/
        currentNodeLevel: '0',    /*当前节点的层级，0：初始化，未选中节点，1:第一级，流程定义，2:第二级，流程环节，3:第三级，路由*/
		menuPath: '',
		/* 弹出框配置 */
		config: {
			title: '选择视图',        /* 弹出框标题 */
			dialogVisible: false,   /* 默认不显示 */
		},
		/* 选择的视图数据 */
		selectData: [],
      };
    },
    methods: {
      /* 视图选择后设置的数据 */
	  setViewInfo() {
		  if (this.selectData.length !== 1) {
			  this.alert('请选择一行！', 'warning');
			  return
		  }
		  let data = this.selectData[0]
		  this.$refs.flowEdit.$refs.mainForm.dataModel.viewId = data.id
		  this.$refs.flowEdit.$refs.mainForm.dataModel.viewName = data.name
		  this.config.dialogVisible = false
	  },
      /* 视图列表点击 */
      viewRowClick(row) {
          this.$refs.viewList.toggleRowSelection(row)
      },
      expandAll() {
        return true
      },
      treeInfoCfg() {
        let mdCode = this.$route.params.mdCode
        let url = this.INTERFACE.moduleListData
        let params = {mdCode: mdCode}
        url = `${this.BASEURL}/jdbc/common/basecommonedit/editJSON.do`
        params.id = this.$route.params.id
        return {url: url, params: params}
      },
      loadNode(node, resolve) {
        if (this.$route.params.id === 'add') {
          // resolve([{'name': '新建流程定义', 'id': 'ROOT'}])
          this.treeDatas = [{'name': '新建流程定义', 'id': 'ROOT'}]
          return
        }
        let c = this.treeInfoCfg()
        this.get(c.url, c.params, (isSuccess, res) => {
            let dataArr = []
            let rt = {}
            for (let key in res) {
                rt[key] = res[key].value
            }
            dataArr.push(rt)
            this.treeDatas = dataArr
            this.busiId = rt.busiType
            /* 加载环节 */
            let url = this.INTERFACE.moduleListData
            let params = {mdCode: this.nodeMdCode}
            params.defaultSearchParam = JSON.stringify([{'name': 'flowId', 'value': rt.id, 'type': 'exact-match'}])
            this.post(url, params, (isSuccess, res1) => {
                if (res1.Rows.length > 0) {
                    this.treeDatas[0].children = res.Rows
                    let rtFlow = this.$refs.tree.getNode(rt.id)
                    let rtNode = {}
                    let length = res1.Rows.length
                    for (let i = 0; i < length; i++) {
                        /* 加载路由 */
                        this.$refs.tree.append(res1.Rows[i], rtFlow)
                        params.mdCode = this.routeMdCode
                        params.defaultSearchParam = JSON.stringify([{'name': 'nodeId', 'value': res1.Rows[i].id, 'type': 'exact-match'}])
                        this.post(url, params, (isSuccess, res2) => {
                            if (res2.Rows.length > 0) {
                                rtNode = this.$refs.tree.getNode(res1.Rows[i].id)
                                this.treeDatas[0].children[i].children = res2.Rows
                                res2.Rows.forEach(route => {
                                    this.$refs.tree.append(route, rtNode)    
                                })
                            }
                        }, true)
                    }
                }
            }, true)

            return
        }, true)
      },
      nodeClick(data, node) {

        if (data.id === 'ROOT') {
          return
        }
        this.currentNodeId = data.id
        this.currentNodeLevel = node.level
        /*点击第一级，也就是流程定义FlwFlow*/
        if (node.level === 1) {
            // params.mdCode = 'FlwNode'
            // params.defaultSearchParam = JSON.stringify([{'name': 'flowId', 'value': data.id, 'type': 'exact-match'}])
            this.newModuleInfo(this.$route.params.mdCode)
        }
        /*点击第二级，也就是环节FlwNode*/
        else if (node.level === 2) {
            // params.mdCode = 'FlwRoute'
            // params.defaultSearchParam = JSON.stringify([{'name': 'nodeId', 'value': data.id, 'type': 'exact-match'}])
            this.setNodeModuleInfo(node)
        }
        /*点击第三级，也就是路由FlwRoute*/
        else if (node.level === 3) {
            this.setRouteModuleInfo(node)
            return
        }
      },
      /**
       *  设置模型信息为环节
       *  isByBtn
       *    true: 通过点击【新增节点】而进来的，因为通过按钮点击的，传进来的node是父级的node
       */
      setNodeModuleInfo(node, isByBtn) {
          this.newModuleInfo('FlwNode', node, isByBtn)
      },
      /**
       *  设置模型信息为路由
       *  isByBtn
       *    true: 通过点击【新增路由】而进来的，因为通过按钮点击的，传进来的node是父级的node
       */
      setRouteModuleInfo(node, isByBtn) {
          this.newModuleInfo('FlwRoute', node, isByBtn)
	  },
	  /* 设置视图模型信息 */
	  setViewModuleInfo() {
			let params = {
				mdCode: `flwViewDictionary`,
                defaultSearchParam: JSON.stringify([{'name': 'busi', value: this.busiId, 'type': 'exact-match'}])
			}
			this.post(`${this.INTERFACE.moduleListData}`, params, (isSuccess, res) => {
				this.gridData = res.Rows
			}, true)
	  },
      async newModuleInfo(mdCode, node, isByBtn) {
            // 销毁再重新渲染 防止edit之间跳转出错
            this.hackReset = false
            this.$nextTick(() => {
                this.hackReset = true
            })
            this.module = await ModuleUtils.editModuleCfg(mdCode)
            this.setModelData(mdCode, node, isByBtn)
      },
      setModelData(mdCode, node, isByBtn) {
          switch (mdCode) {
              case 'FlwNode':
                  /*设置流程定义flowId，业务id到flowNode编辑页中去*/
                  if (isByBtn) {
                      this.$refs.flowEdit.setData('flgHead ', 0)
                      this.$refs.flowEdit.setData('flgRoot ', 0)
                      /*结束节点固定有的*/
                      if (node.childNodes.length <= 1) {
                          this.$refs.flowEdit.setData('flgHead ', 1)
                      }
                      this.$refs.flowEdit.setData('flowId', node.data.id)
                      this.$refs.flowEdit.setData('busiId', node.data.busiType)            
                  } else {
                      this.$refs.flowEdit.setData('flowId', node.parent.data.id)
                      this.$refs.flowEdit.setData('busiId', node.parent.data.busiType)
                  }
                  if ((node.data && node.data.flgRoot === '1')
                        || (node.parent && node.parent.data && node.parent.data.flgRoot === '1')) {
                      return
                  }
                  if (this.currentNodeId !== 'ROOT') {
                      this.$refs.flowEdit.$nextTick(() => {
                          this.$set(this.$refs.flowEdit.buttons, this.$refs.flowEdit.buttons.length, Object.assign({}, this.routeBtn))
                          this.$set(this.$refs.flowEdit.buttons, this.$refs.flowEdit.buttons.length, Object.assign({}, this.deleteBtn))
                          this.$refs.flowEdit.btnSort()
                      });
                  }


                  break
              case 'FlwRoute':
                  /*设置环节nodeId到flowRoute编辑页中去*/
                  if (isByBtn) {
                        this.$refs.flowEdit.setData('nodeId', node.data.id)

                  } else {
                        this.$refs.flowEdit.setData('nodeId', node.parent.data.id)
                        this.$refs.flowEdit.$nextTick(() => {
                            this.$set(this.$refs.flowEdit.buttons, this.$refs.flowEdit.buttons.length, Object.assign({}, this.deleteBtn))
                            this.$refs.flowEdit.btnSort()
                        });
                  }
                  let params = {
                      defaultSearchParam: JSON.stringify([{
                          'name': 'flowId',
                          'value': this.$route.params.id,
                          'type': 'exact-match'
                      }]),
                      sortname: 'priority',
                      sortorder: 'asc'
                  }
                  this.$refs.flowEdit.$refs.mainForm.loadOptions('FlwNode', params)
                  break
              case 'flwFlow':
                  this.$refs.flowEdit.$refs.mainForm.loadOptions('busi', {sortname: 'priority', sortorder: 'asc'})
                  if (this.$route.params.id === 'add') {
                      return
                  }
                  this.$refs.flowEdit.$nextTick(() => {
                      this.$set(this.$refs.flowEdit.buttons, this.$refs.flowEdit.buttons.length, Object.assign({}, this.nodeBtn))
                      this.$refs.flowEdit.btnSort()
                  })
                  break
              default:
                  break
          }
      },
      close() {
        let returnPath = this.$route.query.data.returnPath
        this.$router.push({
            path: returnPath
        })
      },
      hideMenu() { //隐藏树形菜单
        this.hideTree = true
      },
      showMenu() { //隐藏树形菜单
        this.hideTree = false
      },
      resizeList (a, b, c) {
        debugger
      }
	},
    created() {
	  this.newModuleInfo(this.$route.params.mdCode, this.$route.params.symbol, this.$route.query)
      this.loadNode()
    },
    beforeRouteUpdate(to, from, next) {
      let mdCode = to.params.mdCode
      this.newModuleInfo(mdCode, to.params.symbol, to.query)
      this.menuPath = to.path
      next()
	}
  };
</script>

<style scoped>
  .flow-icon .fa {
      color: #447df7;
      font-size: 17px;
  }
  .tree {
    padding-left: 16px;
    width: 270px;
  }

  .list1 {
    padding-left: 10px;
    width: calc(100% - 284px);
  }

  .list2 {
    padding-left: 10px;
    width: calc(100% - 48px);
  }

  .folder {
    color: #2684ce;
  }

  .last-node {
    color: #69a946;
  }

  .tree-title {
    margin: 0;
    background-color: #def2ff;
    padding: 2% 0px 2% 8px;
    color: #183152;
    font-size: 14px;
    border-radius: 4px 4px 0px 0px;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    border-left: 1px solid rgba(0, 0, 0, 0.125);
    border-right: 1px solid rgba(0, 0, 0, 0.125);
  }

  .tree-title i {
    float: right;
    font-size: 20px;
    margin-right: 5px;
  }

  .spread {
    display: inline-block;
    background-color: #EAF2FE;
    border: 1px solid #B8D0D6;
    width: fit-content;
    min-height: calc(100vh * 0.3);
    max-height: calc(100vh * 0.7);
    font-size: 20px;
    margin-left: 15px;
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

  .col-2 {
    padding-right: 0;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #d5d8db;
  }

  .col-11-5 {
    flex: 0 0 95%;
    max-width: 95%;
  }
</style>
