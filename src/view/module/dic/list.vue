<template>
    <div>
        <location :locationPath="menuPath"></location>
        <module-list
            ref="moduleList"
            :module="module"
            :queryParams="queryParams"
            :defaultButtons="defaultButtons">
        </module-list>
    </div>
</template>

<script>
    import {ModuleList, Location} from 'src/components/index'
    import PermissionUtils from 'src/js/PermissionUtils.js'
    import ModuleUtils from 'src/js/ModuleUtils'

    let default_btn = [
        {
            id: 'add',
            name: '新增',
            icon: 'icon iconfont bd-plus',
            click: function () {
                let listPath = this.$parent.$route.path
                this.$router.push({
                    path: `/module/dic/edit/${this.module.code}/add`,
                    query: {
                        data: {
                            returnPath: listPath
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
                let listPath = this.$parent.$route.path
                this.$router.push({
                    path: `/module/dic/edit/${this.module.code}/${selection[selection.length - 1].id}`,
                    query: {
                        data: {
                            returnPath: listPath
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
                }).catch(() => {})
            }
        }
    ]

    export default {
        components: {
            ModuleList,
            Location,
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
            }
        },
        computed: {
            title() {
                return this.module.name
            }
        },
        methods: {
            async newModuleInfo($router) {
                this.module = await ModuleUtils.listModuleCfg($router.params.mdCode)

                this.setDefaultParams($router)
            },
            setDefaultParams($router) {
                // 重置搜索条件
                this.$refs.moduleList.resetQueryParam()

                if (this.module.listJsObj.defaultParam && this.module.listJsObj.defaultParam.init) {
                    let result = this.module.listJsObj.defaultParam.init.call(this, $router.params.symbol)
                    console.log('result', result)
                    for (let key in result) {
                        this.$refs.moduleList.updateQueryParam(key, result[key])
                    }
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
            }
        },
        created() {
            this.$nextTick(() => {
                this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
                this.newModuleInfo(this.$route)
            })
            PermissionUtils.addRouter({
                component: 'module/dic/edit',
                path: 'module/dic/edit/:mdCode/:id',
                parent: 'DashboardLayout'
            })
        },
        beforeRouteUpdate(to, from, next) {
            this.menuPath = this.getLocationPath(to.query.locationPath, to.path)
            this.newModuleInfo(to)
            next()
        }
    }
</script>
