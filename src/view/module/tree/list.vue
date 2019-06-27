<template>
    <div>
        <location :locationPath="menuPath"></location>
        <div class="row">
            <div class="tree" v-if="hackReset" v-show="!hideTree">
                <p class="tree-title" :style="baseStyle"><i class="fa fa-sitemap"></i> {{module.name}}
                    <i @click="hideMenu" class="fa fa-angle-double-left"></i>
                </p>
                <el-tree
                    ref="tree"
                    :props="props1"
                    :load="loadNode"
                    node-key="id"
                    :default-expanded-keys="defaultExpandedKeys"
                    lazy
                    :expand-on-click-node="false"
                    @node-expand="nodeExpand"
                    @node-collapse="nodeClose"
                    @node-click="nodeClick">
                    <div slot-scope="{ node, props1 }" class="tree-lable" :title="node.label">
                        <i :id="node.id"
                           :class="node.isLeaf ? 'last-node fa  fa-list-alt' : 'folder fa  fa-folder'"></i>
                        <span>{{node.label}}</span>
                    </div>
                </el-tree>
            </div>
            <div class="spread" :style="baseStyle" v-show="hideTree">
                <i @click="showMenu" class="fa fa-angle-double-right"></i>
            </div>

            <div :class="{'list1': !hideTree, 'list2': hideTree}">
                <module-list
                    ref="moduleList"
                    :listTitle="listTitle"
                    :url="url"
                    :module="module"
                    :queryParams="queryParams"
                    :sortname="sortname"
                    :sortorder="sortorder"
                    :defaultButtons="defaultButtons"
                    @deleteAfter="deleteAfter">
                </module-list>
            </div>
        </div>
    </div>
</template>

<script>
    import PermissionUtils from 'src/js/PermissionUtils.js'
    import {Tree} from 'element-ui'
    import {ModuleList, Location} from 'src/components/index'
    import ModuleUtils from 'src/js/ModuleUtils'

    let default_btn = [
        {
            id: 'add',
            name: '新增',
            icon: 'icon iconfont bd-plus',
            click: function () {
                let tree = this.$parent.$refs.tree
                let nodeId = this.$parent.currentNodeId
                let node = tree.getNode(nodeId)
                let listPath = this.$parent.$route.path
                this.$router.push({
                    path: `/module/tree/edit/${this.module.code}/add`,
                    query: {
                        data: {
                            returnPath: listPath,
                            parent: node.data,
                            fullPath: node.data.fullPath
                        }
                    }
                })
            }
        }, {
            id: 'edit',
            name: '修改',
            icon: 'icon iconfont bd-edit',
            click: function () {
                let selection = this.$refs.list.selection
                if (selection.length === 0) {
                    this.alert('请选择一行！')
                    return
                }
                let id = selection[selection.length - 1].id
                let tree = this.$parent.$refs.tree
                let nodeId = this.$parent.currentNodeId
                let node = tree.getNode(nodeId)
                let parent = node.data
                let fullPath = parent.fullPath
                // 如果编辑的数据id，等于当前选中的树节点id，那么 parent 的数据为当前节点的父节点
                if (nodeId === id) {
                    parent = node.parent.data
                }
                let listPath = this.$parent.$route.path
                this.$router.push({
                    path: `/module/tree/edit/${this.module.code}/${id}`,
                    query: {
                        data: {
                            returnPath: listPath,
                            parent: parent,
                            fullPath: fullPath
                        }
                    }
                })
            }
        }, {
            id: 'delete',
            name: '删除',
            icon: 'icon iconfont bd-trash-alt-o',
            click: function () {
                let selection = this.$refs.list.selection
                if (selection.length === 0) {
                    this.alert('至少选择一行！')
                    return
                }

                this.$confirm('确定删除吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        mdCode: this.module.code,
                        ids: selection.map(e => e.id).join(',')
                    }
                    this.post(`${this.BASEURL}/jdbc/common/basecommondelete/delete.do`, params, (isSuccess, res) => {
                        if (res.hasOk) {
                            this.$refs.list.refresh()
                            this.alert('删除成功', 'success')
                            this.$emit('deleteAfter', selection)
                        } else {
                            this.alert('删除失败', 'error')
                        }
                    }, true)
                })
            }
        },
        {
            id: "view",
            name: '查看',
            click: function () {
                let selection = this.$refs.list.selection
                if (selection.length === 0) {
                    this.alert('请选择一行！')
                    return
                }
                let listPath = this.$parent.$route.path
                this.$router.push({
                    path: `/module/view/view/${this.module.code}/${selection[selection.length - 1].id}`,
                    query: {
                        data: {
                            returnPath: listPath
                        }
                    }
                })
            }
        }
    ]

    export default {
        components: {
            [Tree.name]: Tree,
            ModuleList,
            Location
        },
        computed: {
            baseStyle() {
                let style = this.$store.getters['SysStyle/baseStyle']
                return {
                    backgroundColor: style.backgroundColor,
                    color: style.color
                }
            }
        },
        data() {
            return {
                hideTree: false,
                hackReset: false,
                props1: {
                    label: 'name',
                    isLeaf(data) {
                        return !(data.isParent || data.hasChild)
                    }
                },
                module: {
                    id: '',
                    code: '',
                    name: '',
                    moduleDisplay: [],
                    listJs: '',
                    listJsObj: {},
                    selectorData: [],
                    searchCondition: [],
                },
                defaultSearchParam: [],
                queryParams: {},
                sortname: '',
                sortorder: '',
                customDefaultParams: {},
                defaultButtons: default_btn,
                defaultExpandedKeys: [],  // 默认展开的树节点
                currentNodeId: 'ROOT', // 默认加载列表的树节点id
                menuPath: '',
                url: '',
                listTitle: '', // 列表title
            };
        },
        methods: {
            treeInfoCfg(parent) {
                if (this.module.listJsObj.treeInfoCfg) {
                    return this.module.listJsObj.treeInfoCfg.call(this, parent)
                }
                let mdCode = this.$route.params.mdCode
                let url = `${this.BASEURL}/jdbc/common/basecommontree/tree.do`
                let params = {mdCode: mdCode}
                if (parent) {
                    params.nodeId = parent.id
                }
                return {url: url, params: params}
            },
            /**
             * 成功更新了默认搜索条件返回true，否则返回false
             */
            updateDefaultSearchParam(key, value) {
                let param = this.defaultSearchParam.filter(p => p.name === key)
                if (param.length > 0 && param[0].value != value) {
                    param[0].value = value
                    this.queryParams = {defaultSearchParam: JSON.stringify(this.defaultSearchParam)}
                    this.$refs.moduleList.updateQueryParam('defaultSearchParam', JSON.stringify(this.defaultSearchParam))
                    return true
                }
                return false
            },
            setListTitleByTreeData(data) {
                for (let key in data) {
                    if (data[key].id == this.currentNodeId) {
                        this.listTitle = data[key].name
                        break;
                    }
                }
            },
            loadNode(node, resolve) {
                let c = this.treeInfoCfg(node.data)
                this.get(c.url, c.params, (isSuccess, res) => {
                    this.setListTitleByTreeData(res)
                    if (node.level > 0) {
                        resolve(res)
                        return
                    }
                    /*
                     * 加载根节点时，返回的数据会包含根节点的子节点，这是老版本的UI数据
                     * 因为目前（2019-2-13）后台获取数据的方法没有修改，所以这里进行过滤，
                     * 只返回根节点
                     */
                    for (let key in res) {
                        if (res[key].id === 'ROOT') {
                            resolve([res[key]])
                            break
                        }
                    }
                }, true)
            },
            nodeClick(data) {
                this.listTitle = data.name
                this.currentNodeId = data.id
                // 模型列表 js 定义了更新默认查询参数的方法，通过方法的返回值更新
                if (this.module.listJsObj.defaultParam && this.module.listJsObj.defaultParam.getUpdateData) {
                    let result = this.module.listJsObj.defaultParam.getUpdateData.call(this, data)
                    for (let key in result) {
                        this.$refs.moduleList.updateQueryParam(key, result[key])
                    }
                    setTimeout(this.$refs.moduleList.reset)
                    return
                }

                // 如果模型 js 没有定义更新默认查询参数的方法，使用默认的配置
                if (this.updateDefaultSearchParam('parentId', data.id)) {
                    setTimeout(this.$refs.moduleList.reset)
                }
            },
            async newModuleInfo($router) {
                this.module = await ModuleUtils.listModuleCfg($router.params.mdCode)
                this.url = `${this.BASEURL}/jdbc/common/basecommontreelist/listJSON.do?mdCode=${this.module.code}&addParent=false`
                this.setDefaultParams($router)

                // 销毁树再重新渲染
                this.hackReset = false
                this.$nextTick(() => {
                    this.hackReset = true
                })
            },
            setDefaultParams($router) {
                // 重置搜索条件
                this.$refs.moduleList.resetQueryParam()

                let query = $router.query
                this.defaultExpandedKeys = []
                if (query.editData && query.editData.fullPath && query.editData.fullPath !== 'ROOT') {
                    let arr = query.editData.fullPath.split('-')
                    this.currentNodeId = arr.splice(arr.length - 1, 1)[0]
                    this.defaultExpandedKeys.push(...arr)
                } else {
                    this.currentNodeId = 'ROOT'
                    this.defaultExpandedKeys.push('ROOT')
                }

                // 设置url上的默认查询参数
                for (let key in $router.query) {
                    // editData 是从编辑页返回列表页时带上的一些页面所需参数，不许提交到列表查询的请求中
                    if (key !== 'editData') {
                        this.$refs.moduleList.updateQueryParam(key, $router.query[key])
                    }
                }

                // 判断模型js是否有设置默认查询参数的方法，如果有通过该方法设置默认查询参数
                if (this.module.listJsObj.defaultParam && this.module.listJsObj.defaultParam.init) {
                    this.sortname = ''
                    this.sortorder = ''
                    let result = this.module.listJsObj.defaultParam.init.call(this, $router.params.symbol, {currentNodeId: this.currentNodeId});
                    for (let key in result) {
                        this.$refs.moduleList.updateQueryParam(key, result[key])
                    }
                    this.customDefaultParams = result
                } else {
                    // 如果没有使用，使用标准的默认查询参数
                    this.sortname = 'layerNum,priority'
                    this.sortorder = 'asc,asc'
                    this.defaultSearchParam = [{"name": "parentId", "type": "exact-match", "value": this.currentNodeId}]
                    this.$refs.moduleList.updateQueryParam('defaultSearchParam', JSON.stringify(this.defaultSearchParam))
                }

            },
            deleteAfter(data) {
                data.forEach(d => this.$refs.tree.remove(d.id))
            },
            nodeExpand(data) { //节点展开时图标替换
                document.getElementById(data.$treeNodeId).classList.remove('fa-folder')
                document.getElementById(data.$treeNodeId).classList.add('fa-folder-open')
            },
            nodeClose(data) { //节点关闭时图标替换
                document.getElementById(data.$treeNodeId).classList.remove('fa-folder-open')
                document.getElementById(data.$treeNodeId).classList.add('fa-folder')
            },
            hideMenu() { //隐藏树形菜单
                this.hideTree = true
            },
            showMenu() { //隐藏树形菜单
                this.hideTree = false
            },
            /**
             * 获取当前的树节点数据
             */
            getCurrentNodeData() {
                let tree = this.$refs.tree
                let node = tree.getNode(this.currentNodeId)
                return node.data
            },
            getLocationPath(locationPath, menuPath) {
                if (locationPath) {
                    return locationPath
                }
                let menu = this.$store.getters['permission/getByPath'](menuPath)
                if (menu) {
                    let arr = menu.fullName.split('-')
                    arr.splice(0, 1)
                    return arr.join('-')
                }
                return ''
            }
        },
        created() {
            this.$nextTick(() => {
                this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
                this.newModuleInfo(this.$route)
            })
            PermissionUtils.addRouter({
                component: 'module/tree/edit',
                path: 'module/tree/edit/:mdCode/:id',
                parent: 'DashboardLayout'
            })
            PermissionUtils.addRouter(
                {
                    component: 'module/view/view',
                    path: 'module/view/view/:mdCode/:id',
                    parent: 'DashboardLayout'
                }
            )
        },
        beforeRouteUpdate(to, from, next) {
            this.newModuleInfo(to)
            this.menuPath = this.getLocationPath(to.query.locationPath, to.path)
            next()
        }
    };
</script>

<style scoped>
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

    .tree-title .fa-angle-double-left {
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

    .tree-lable {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
    }
</style>
