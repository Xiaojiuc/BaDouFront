<template>
    <div>
        <location :locationPath="menuPath"></location>
        <module-edit
            v-if="hackReset"
            :module="module"
            :defaultButtons="defaultButtons">
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
                    let url = `${_this.BASEURL}/jdbc/common/basecommonsave/saveIncludeFile.do?mdCode=${_this.module.code}`
                    _this.postFile(url, _this.$refs.mainForm.dataModel, (isSuccess, res) => {
                        if (res.hasOk) {
                            _this.alert('保存成功', 'success')
                            _this.$parent.close()
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
                this.$parent.close()
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
                hackReset: true,
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
                menuPath: ''
            }
        },
        methods: {
            async newModuleInfo(mdCode) {
                // 销毁再重新渲染 防止edit之间跳转出错
                this.hackReset = false
                this.$nextTick(() => {
                    this.hackReset = true
                })

                this.module = await ModuleUtils.editModuleCfg(mdCode)
            },
            close() {
                let returnPath = this.$route.query.data.returnPath
                this.$router.push({
                    path: returnPath
                })
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
            this.menuPath = this.getLocationPath(this.$route.query.locationPath, this.$route.path)
            this.newModuleInfo(this.$route.params.mdCode)
        },
        beforeRouteUpdate(to, from, next) {
            this.menuPath = this.getLocationPath(to.query.locationPath, to.path)
            let mdCode = to.params.mdCode
            this.newModuleInfo(mdCode)
            next()
        }
    }
</script>

<style scoped>

</style>
