<template>
    <div>

        <card>
            <flow-router-button
                    :flowInfo="flowInfo"
                    :mdCode="module.code"
                    @closed="_handerClosed">
            </flow-router-button>
            <button v-for='btn in buttons' v-if="!btn.isHide" @click='exeMethod(btn.id)' class='btn' :class="$store.getters['SysStyle/btnClass']"><i
                :class="btn.icon"></i>{{ btn.name }}
            </button>
        </card>

        <!-- 有父子关系时，使用tab -->
        <el-tabs
            v-if="useTab"
            type="border-card"
            v-model="activeTabName"
            :before-leave="handerBeforeLeave">

            <!-- 主表数据 -->
            <el-tab-pane :label="module.name" name="main">
                <module-form ref="mainForm" :module="module"></module-form>
            </el-tab-pane>
            <el-tab-pane
                v-for="(item, index) in childrenTab" :key="index"
                :label="item.displayName"
                :name="index + ''">
                <child-module-edit
                    :moduleLink="item"
                    :recordId="recordId">
                </child-module-edit>
            </el-tab-pane>
        </el-tabs>

        <!-- 没有父子关系使用默认表单 -->
        <module-form v-else ref="mainForm" :module="module"></module-form>
    </div>
</template>

<script>
    import {Tabs, TabPane} from 'element-ui'
    import ModuleForm from './ModuleForm'
    import ChildModuleEdit from './ChildModuleEdit'
    import FlowRouterButton from '../flow/FlowRouterButton'
    import {Validator} from 'vee-validate'

    export default {
        name: 'module-edit',
        components: {
            ModuleForm,
            FlowRouterButton,
            ChildModuleEdit,
            [Tabs.name]: Tabs,
            [TabPane.name]: TabPane
        },
        props: {
            module: {
                type: Object,
                default() {
                    return {}
                }
            },
            defaultButtons: {
                type: Array
            },
            recordId: {
                type: String
            },
            flowInfo: {
                type: Object
            }
        },
        data() {
            return {
                activeTabName: 'main',
                buttons: [],
                childrenTab: []
            }
        },
        computed: {
            btnMethod() {
                let obj = {}
                this.buttons.forEach(btn => obj[btn.id] = btn.click)
                return obj
            },
            useTab() {
                return this.childrenTab && this.childrenTab.length > 0
            }
        },
        methods: {
            exeMethod(method) {
                this.btnMethod[method].call(this)
            },
            randerBtn(newButtons) {
                // 获取默认按钮
                let btns = Object.assign([], this.defaultButtons)

                // 如果外部JS参数没有配置按钮，那么按钮为原来的按钮
                if (typeof newButtons === 'undefined') {
                    this.buttons = btns
                    return
                }

                // 如果外部JS参数按钮是一个空数组，表示清空按钮，上面复制参数后已经把空数组复制过去，这里直接返回
                if (newButtons.length <= 0) {
                    this.buttons = []
                    return;
                }

                // 暂时存储新的按钮
                let arr = [];
                // 遍历按钮，替换需要替换的
                for (let nKey in newButtons) {
                    let newBtn = newButtons[nKey];
                    for (let key in btns) {
                        if (newBtn.id == btns[key].id) {
                            btns[key] = newBtn;
                            newBtn = null;
                            break;
                        }
                    }
                    if (newBtn) {
                        arr.push(newBtn);
                    }
                }

                // 添加新的按钮
                arr.forEach(b => btns.push(b))

                this.buttons = btns
            },
            setData(key, value) {
                this.$refs.mainForm.setData(key, value)
            },
            setChildrenTab(children) {
                this.childrenTab = []
                if (!children || children.length === 0) {
                    return
                }
                children.filter(child => child.showTab === 1).forEach(child => this.childrenTab.push(child))
            },
            handerBeforeLeave() {
                if (this.recordId === 'add') {
                    this.alert('请先保存数据')
                    return false
                }
            },
            /**
             * @return {boolean} 如果有 tab 返回 true，否则返回 false
             */
            hasTab() {
                return this.childrenTab.length > 0
            },
            _handerClosed() {
                this.$parent.close(true)
            }
        },
        watch: {
            module: {
                deep: true,
                immediate: true,
                handler: function () {
                    if (this.module.editedJsObj.init) {
                        this.module.editedJsObj.init.call(this, Validator)
                    }
                    this.randerBtn(this.module.editedJsObj.editButtons)
                    this.setChildrenTab(this.module.childTab)
                }
            },
            defaultButtons: {
                immediate: true,
                handler: function () {
                    this.randerBtn()
                }
            }
        }
    }
</script>

<style scoped>
    .card {
        margin-bottom: 10px;
    }

    .card-body button {
        margin-right: 10px;
    }
</style>
