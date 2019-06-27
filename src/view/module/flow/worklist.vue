<template>
    <div>
        <location :locationPath="menuPath"></location>
        <module-list
            ref="moduleList"
            :module="module"
            :queryParams="queryParams"
            :defaultButtons="defaultButtons"
            :url="url"
            :colsFormatter="colsFormatter"
            >
        </module-list>
    </div>
</template>

<script>
/* 待办已办列表 
待办:module/flow/worklist?mdCode=myRecWlItem&symbol=undo&type=undo
已办:module/flow/worklist?mdCode=myRecWlItem&symbol=done&type=done
*/
    import {ModuleList, Location} from 'src/components/index'
    import PermissionUtils from 'src/js/PermissionUtils.js'
    import ModuleUtils from 'src/js/ModuleUtils'

    let default_btn = [
    ]

    export default {
        components: {
            ModuleList,
            Location
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
                defaultButtons: JSON.parse(JSON.stringify(default_btn)),
                menuPath: '',
                url: '',
                colsFormatter: {}
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
                this.initDefaultButtons()
                this.url = this.getUrl()
                this.colsFormatter = this.getColsFormatter()
            },
            initDefaultButtons() {
                this.defaultButtons.forEach(btn => {
                    default_btn.forEach(_btn => {
                        if (btn.id === _btn.id) {
                            btn.click = _btn.click
                        }
                    })
                });
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
            getUrl() {
                var url = '/process/gtasks/worklist/listUndoByUser.do'
                switch (this.$route.query.type) {
                    case 'undo':
                        url = '/process/gtasks/worklist/listUndoByUser.do'
                        break
                    case 'done':
                        url = '/process/gtasks/worklist/listDoneByUser.do'
                        break
                    case 'unread':
                        break
                    case 'read':
                        break
                }
                return this.BASEURL + url
            },
            getColsFormatter() {
                let f = {
                    title: { 
                        formatter: function(row, column, value, index, vue) {
                            return "<a href='javascript:;'>"+value+"</a>"
                        }, 
                        hander: function(row, value, index, vue) {
                            var url = '/process/gtasks/frontworks/undo.do'
                            switch (vue.$route.query.type) {
                                case 'undo':
                                    url = '/process/gtasks/frontworks/undo.do'
                                    break
                                case 'done':
                                    url = '/process/gtasks/frontworks/done.do'
                                    break
                                case 'unread':
                                    break
                                case 'read':
                                    break
                            }
                            vue.get(vue.BASEURL + url,
                                {worklistItemId: row.id}, (isSuccess, res) => {
                                    if (res && res.hasOk) {
                                        let listPath = vue.$parent.$route.path
                                        vue.$router.push({
                                            path: res.data.url + res.data.boId,
                                            query: {
                                                returnPath: listPath,
                                                worklistItemId: row.id,
                                                workType: vue.$route.query.type
                                            }
                                        })
                                    } else {
                                        this.alert('删除失败', res.errMsg)
                                    }
                                }, true)

                        }
                    }
                } 
                if (this.$route.query.type == 'undo') {
                    f['dealDate'] = false
                }
                return f
            }
        },
        created() {
            this.$nextTick(() => {
                this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
                this.newModuleInfo(this.$route)
            })
            PermissionUtils.addRouter({
                component: 'module/flow/edit',
                path: 'module/flow/edit/:mdCode/:id',
                parent: 'DashboardLayout'
            })
            PermissionUtils.addRouter({
                component: 'module/flow/view',
                path: 'module/flow/view/:mdCode/:id',
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
