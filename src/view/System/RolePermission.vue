<template>
    <div>
        <location :locationPath="menuPath"></location>
        <div class="row">
            <div class="tree" v-if="hackReset" v-show="!hideTree">
                <p class="tree-title" :style="baseStyle">{{module.name}}
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
          <span slot-scope="{ node, props1 }">
          <span><i :id="node.id" :class="node.isLeaf ? 'last-node fa  fa-list-alt' : 'folder fa  fa-folder'"></i></span>
          <span>{{node.label}}</span>
        </span>
                </el-tree>
            </div>
            <div class="spread" style="baseStyle" v-show="hideTree">
                <i @click="showMenu" class="fa fa-angle-double-right"></i>
            </div>

            <div :class="{'list1': !hideTree, 'list2': hideTree}">
                <permission_tree
                    ref="moduleList"
                    :module="module"
                    :queryParams="queryParams"
                    :defaultButtons="defaultButtons"
                    @deleteAfter="deleteAfter">
                </permission_tree>
            </div>
        </div>
    </div>
</template>

<script>
    import PermissionUtils from 'src/js/PermissionUtils.js'
    import {Tree} from 'element-ui'
    import {Location} from 'src/components/index'
    import ModuleUtils from 'src/js/ModuleUtils'
    import Permission from './Permission.vue'

    let default_btn = [
        {
            id: 'add',
            name: '保存',
            icon: 'icon iconfont bd-plus',
            click: function () {
                let params = {
                    "roleId": this.$parent.currentNodeId,
                    "mids": this.getCheckedNodeKeys()
                }
                this.post(`${this.BASEURL}/auth/assign/roleresourceassignmenu/save.do`, params, (isSuccess, res) => {
                    if (res.hasOk) {
                        this.reset()
                        this.alert('操作成功', 'success')
                    } else {
                        this.alert('操作失败', 'error')
                    }
                }, true)
            }
        }
    ]

    export default {
        components: {
            [Tree.name]: Tree,
            [Permission.name]: Permission,
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
                    this.$refs.moduleList.updateQueryParam(key, value)
                    return true
                }
                return false
            },
            loadNode(node, resolve) {
                let c = this.treeInfoCfg(node.data)
                this.get(c.url, c.params, (isSuccess, res) => {
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
                        }
                    }
                }, true)
            },
            nodeClick(data) {
                this.currentNodeId = data.id
                // 如果模型 js 没有定义更新默认查询参数的方法，使用默认的配置
                if (this.updateDefaultSearchParam('parentId', data.id)) {
                    setTimeout(this.$refs.moduleList.reset)
                }
            },
            async newModuleInfo(mdCode, symbol, query) {
                this.module = await ModuleUtils.listModuleCfg(mdCode)
                this.setDefaultParams(symbol, query)

                // 销毁树再重新渲染
                this.hackReset = false
                this.$nextTick(() => {
                    this.hackReset = true
                })
            },
            setDefaultParams(symbol, query) {
                // 重置搜索条件
                this.$refs.moduleList.resetQueryParam()

                this.defaultExpandedKeys = []
                if (query.data && query.data.fullPath && query.data.fullPath !== 'ROOT') {
                    let arr = query.data.fullPath.split('-')
                    this.currentNodeId = arr.splice(arr.length - 1, 1)[0]
                    this.defaultExpandedKeys.push(...arr)
                } else {
                    this.defaultExpandedKeys.push('ROOT')
                }
                // 判断模型js是否有设置默认查询参数的方法，如果有通过该方法设置默认查询参数
                if (this.module.listJsObj.defaultParam && this.module.listJsObj.defaultParam.init) {
                    this.sortname = ''
                    this.sortorder = ''
                    let result = this.module.listJsObj.defaultParam.init.call(this, symbol, {currentNodeId: this.currentNodeId});
                    for (let key in result) {
                        this.$refs.moduleList.updateQueryParam(key, result[key])
                    }
                    this.customDefaultParams = result
                    return
                }

                // 如果没有使用，使用标准的默认查询参数
                this.sortname = 'priority'
                this.sortorder = 'asc'
                this.defaultSearchParam = [{"name": "parentId", "type": "exact-match", "value": this.currentNodeId}]
                this.$refs.moduleList.updateQueryParam('roleId', this.currentNodeId)
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
            if (this.$route.query.roleId) {
                this.currentNodeId = this.$route.query.roleId
            }
            this.$nextTick(() => {
                this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
                this.newModuleInfo(this.$route.params.mdCode, this.$route.params.symbol, this.$route.query)
            })
            PermissionUtils.addRouter({
                component: 'module/tree/edit',
                path: 'module/tree/edit/:mdCode/:id',
                parent: 'DashboardLayout'
            })
        },
        beforeRouteUpdate(to, from, next) {
            let mdCode = to.params.mdCode
            this.newModuleInfo(mdCode, to.params.symbol, to.query)
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
