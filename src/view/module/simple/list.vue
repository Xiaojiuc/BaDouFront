<template>
    <div>
        <location :locationPath="menuPath"></location>
        <module-list
            ref="moduleList"
            :module="module"
            :queryParams="queryParams"
            :defaultButtons="defaultButtons">
        </module-list>

        <simple-edit
            ref="simpleEdit"
            :mdCode="module.code"
            @saveSuccess="refreshList">
        </simple-edit>
    </div>
</template>

<script>
    import {ModuleList, Location} from 'src/components/index'
    import PermissionUtils from 'src/js/PermissionUtils.js'
    import ModuleUtils from 'src/js/ModuleUtils'
    import SimpleEdit from './edit'

    let default_btn = [
        {
            id: 'add',
            name: '新增',
            icon: 'icon iconfont bd-plus',
            click: function () {
                let listPath = this.$parent.$route.path
                this.$parent.showEditDialog()
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
                this.$parent.showEditDialog(selection[selection.length - 1].id)
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
        }
    ]

    export default {
        components: {
            ModuleList,
            Location,
            SimpleEdit
        },
        data() {
            return {
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
                queryParams: {},
                defaultButtons: default_btn,
                menuPath: '',
                editDialogVisible: false
            }
        },
        computed: {
            title() {
                return this.module.name
            },
        },
        methods: {
            async newModuleInfo($router) {
                this.module = await ModuleUtils.listModuleCfg($router.params.mdCode)
                this.setDefaultParams($router)
            },
            setDefaultParams($router) {
                // 重置搜索条件
                this.$refs.moduleList.resetQueryParam()

                // 从列表页js中获取默认查询参数
                if (this.module.listJsObj.defaultParam && this.module.listJsObj.defaultParam.init) {
                    let result = this.module.listJsObj.defaultParam.init.call(this, $router.params.symbol)
                    for (let key in result) {
                        this.$refs.moduleList.updateQueryParam(key, result[key])
                    }
                }

                // 设置url上的默认查询参数
                for (let key in $router.query) {
                    this.$refs.moduleList.updateQueryParam(key, $router.query[key])
                }
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
            },
            showEditDialog(id) {
                this.$refs.simpleEdit.showDialog(id)
            },
            refreshList() {
                this.$refs.moduleList.reset()
            }
        },
        created() {
            this.$nextTick(() => {
                this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
                this.newModuleInfo(this.$route)
            })
            PermissionUtils.addRouter(
                {
                    component: 'module/stander/edit',
                    path: 'module/stander/edit/:mdCode/:id',
                    parent: 'DashboardLayout'
                }
            )
            PermissionUtils.addRouter(
                {
                    component: 'module/view/view',
                    path: 'module/view/view/:mdCode/:id',
                    parent: 'DashboardLayout'
                }
            )
        },
        beforeRouteUpdate(to, from, next) {
            this.menuPath = this.getLocationPath(to.query.locationPath, to.path)
            this.newModuleInfo(to)
            next()
        }
    }
</script>
