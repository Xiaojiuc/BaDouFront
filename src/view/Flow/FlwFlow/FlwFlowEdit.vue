<template>
    <div>
        <card>
            <button v-for='btn in buttons' v-if="!btn.isHide" @click='exeMethod(btn.id)' class='btn btn-primary'><i
                :class="btn.icon"></i>{{ btn.name }}
            </button>
        </card>

        <flwflow-form ref="mainForm" :module="module"></flwflow-form>
    </div>
</template>

<script>
    import FlwFlowForm from './FlwFlowForm.vue'

    export default {
        name: 'flwflow-edit',
        components: {
            [FlwFlowForm.name]: FlwFlowForm
        },
        props: {
            module: {
                type: Object,
                default() {
                    return {
                        id: '',
                        code: '',
                        name: '',
                        fields: [],
                        dic: {},
                        editedJs: '',
                        editedJsObj: {}
                    }
                }
            },
            defaultButtons: {
                type: Array
            }
        },
        data() {
            return {
                buttons: []
            }
        },
        computed: {
            btnMethod() {
                let obj = {}
                this.buttons.forEach(btn => obj[btn.id] = btn.click)
                return obj
            }
        },
        methods: {
            exeMethod(method) {
                this.btnMethod[method].call(this)
            },
            /*排序按钮*/
            btnSort() {
                this.buttons.sort(function (bt1, bt2) {
                    return bt1.priority - bt2.priority
                })
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
            }
        },
        watch: {
            module: {
                deep: true,
                handler: function () {
                    this.randerBtn(this.module.editedJsObj.editButtons)
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
