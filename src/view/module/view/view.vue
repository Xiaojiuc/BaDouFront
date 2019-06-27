<template>
    <div>
        <location :locationPath="module.name"></location>
        <module-view
            ref="editElem"
            v-if="hackReset"
            :module="module"
            :defaultButtons="defaultButtons"
            :recordId="recordId">
        </module-view>
    </div>
</template>

<script>
    import {ModuleView, Location} from 'src/components/index'
    import ModuleUtils from 'src/js/ModuleUtils'

    let default_btn = [
        {
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
            ModuleView,
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
                    editedJsObj: {},
                    childTab: []
                },
                defaultButtons: default_btn,
                recordId: ''
            }
        },
        methods: {
            async newModuleInfo(mdCode) {
                // 销毁再重新渲染 防止edit之间跳转出错
                this.hackReset = false
                this.$nextTick(() => {
                    this.hackReset = true
                })
                this.module = await ModuleUtils.viewModuleCfg(mdCode)
                this.recordId = this.$route.params.id
            },
            close(force, newRecordId) {
                // 关闭时，返回的路径
                let returnPath = this.$route.query.data.returnPath
                let closeFun = () => {
                    this.$router.push({
                        path: returnPath
                    })
                }

                // 强制关闭
                if (force) {
                    closeFun()
                    return
                }

                let hasTab = this.$refs.editElem.hasTab()
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
                    path: `/module/view/view/${this.module.code}/${newRecordId}`,
                    query: {
                        data: {
                            returnPath: returnPath
                        }
                    }
                })
            },
        },
        created() {
            this.newModuleInfo(this.$route.params.mdCode)
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
