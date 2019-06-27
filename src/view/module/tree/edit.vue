<template>
    <div>
        <location :locationPath="module.name"></location>
        <module-edit
            ref="moduleEdit"
            :module="module"
            :defaultButtons="defaultButtons"
            :recordId="recordId">
        </module-edit>
    </div>
</template>

<script>
    import {ModuleEdit, Location} from 'src/components/index'
    import ModuleUtils from 'src/js/ModuleUtils'

    let default_btn = [
        {
            id: 'save',
            name: '保存',
            icon: 'icon iconfont bd-save-o',
            click: function () {
                let _this = this;
                this.$refs.mainForm.validate(function () {
                    let url = `${_this.BASEURL}/jdbc/common/basecommontreesave/saveIncludeFile.do?mdCode=${_this.module.code}`
                    _this.postFile(url, _this.$refs.mainForm.dataModel, (isSuccess, res) => {
                        if (res.hasOk) {
                            _this.alert('保存成功', 'success')
                            // 有子表的时候，保持后，设置recordId，不然编辑页子表数据无法正常显示，需要重新进入编辑页才能正常显示
                            _this.$parent.recordId = res.bean.id
                            _this.$parent.close(false, res.bean.id)
                        } else {
                            _this.alert(`保存失败！${res.message}`)
                        }
                    }, true)
                });
            }
        }, {
            id: 'close',
            name: '关闭',
            icon: 'icon iconfont bd-times',
            click: function () {
                this.$parent.close(true)
            }
        }
    ]

    export default {
        components: {
            ModuleEdit,
            Location
        },
        data() {
            return {
                module: {
                    id: '',
                    code: '',
                    name: '',
                    fields: [],
                    dic: {},
                    editedJs: '',
                    editedJsObj: {}
                },
                defaultButtons: default_btn,
                recordId: ''
            }
        },
        methods: {
            async newModuleInfo(mdCode) {
                this.module = await ModuleUtils.editModuleCfg(mdCode)
                this.setDataModel()
                this.recordId = this.$route.params.id
            },
            close(force, newRecordId) {
                let fullPath = this.$route.query.data.fullPath
                let returnPath = this.$route.query.data.returnPath

                let closeFun = () => {
                    this.$router.push({
                        path: returnPath,
                        query: {
                            editData: {
                                fullPath
                            }
                        }
                    })
                }

                // 强制关闭
                if (force) {
                    closeFun()
                    return
                }

                let hasTab = this.$refs.moduleEdit.hasTab()
                // 如果没有 tab 关闭编辑页
                if (!hasTab) {
                    closeFun()
                    return
                }

                // 如果编辑的id，与保存后的id一致，为更新，不需要做任何操作
                if (this.recordId === newRecordId) {
                    return
                }

                // 有tab的时候，带上记录id再次跳转到编辑页
                this.$router.push({
                    path: `/module/stander/edit/${this.module.code}/${newRecordId}`,
                    query: {
                        data: {
                            returnPath: returnPath
                        }
                    }
                })
            },
            setDataModel() {
                let data = this.$route.query.data.parent
                if (this.module.editedJsObj.initDataModel) {
                    let result = this.module.editedJsObj.initDataModel.call(this, data)
                    console.log(result)
                    for (let key in result) {
                        this.$refs.moduleEdit.setData(key, result[key])
                    }
                } else {
                    this.$refs.moduleEdit.setData('parentId', data.id)
                    this.$refs.moduleEdit.setData('parentName', data.name)
                }
            }
        },
        created() {
            this.$nextTick(() => {
                this.newModuleInfo(this.$route.params.mdCode)
                this.hackReset = true
            })
        },
        beforeRouteUpdate(to, from, next) {
            let mdCode = to.params.mdCode
            this.newModuleInfo(mdCode)
            next()
        }
    }
</script>

<style scoped>

</style>
