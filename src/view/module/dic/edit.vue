<template>
    <div>
        <location :locationPath="module.name"></location>
        <div>
            <card>
                <button v-for='btn in buttons' v-if="!btn.isHide" @click='exeMethod(btn.id)' class='btn btn-primary'><i
                    :class="btn.icon"></i>{{ btn.name }}
                </button>
            </card>

            <module-form ref="mainForm" :module="module"></module-form>
            <form ref='childForm' id='childForm'>
                <card>
                    <span style="margin-right: 10px;">{{module.childTab.name}}</span>
                    <button class='btn btn-primary' @click.prevent="addItem">新增项</button>
                    <table class="table table-bordered" style='text-align: center;margin-top: 10px;'>
                        <thead>
                        <tr>
                            <td style="border-bottom: none;">操作</td>
                            <td v-for='field in module.childTab.fields' v-if='!(field.type == "hidden")'
                                :key='field.id'
                                style="border-bottom: none;">
                                    {{field.display}}
                                    <span v-if='field.required' style="color: red;">*</span>
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='item,index in dicItems'>
                            <td>
                                <el-button plain @click.prevent="deleteItem(index, $event)">删除</el-button>
                            </td>
                            <td v-for='field in module.childTab.fields' v-if='!(field.type == "hidden")'>
                                <el-input
                                    v-if="field.type === 'hidden'"
                                    type='hidden'
                                    :placeholder="field.display"
                                    :name="field.name"
                                    v-model="item[field.name]"
                                >
                                </el-input>
                                <fg-input
                                    v-if="field.type === 'text'"
                                    :placeholder="field.display"
                                    :name="genField(field.name, index)"
                                    v-model="item[field.name]"
                                    :required="field.required"
                                    v-validate='genModelValid(field.name, index)'
                                    :error="getError(field.name, index)"
                                >
                                </fg-input>
                                <!-- 下拉框 -->
                                <el-select :error="getError(field.name)" :required="field.required"
                                           v-validate='childModelValidations[field.name]' v-if="field.type === 'select'"
                                           v-model="item[field.name]" :name="field.name" placeholder="请选择">
                                    <el-option
                                        v-for="d in module.childTab.dic[field.dic]"
                                        :key="d.id"
                                        :label="d.text"
                                        :value="d.id"
                                        class="select-default"
                                    >
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </card>
            </form>

        </div>
    </div>
</template>

<script>
    import {ModuleEdit, Location} from 'src/components/index'
    import ModuleUtils from 'src/js/ModuleUtils'
    import ModuleForm from 'src/components/module/ModuleForm.vue'
    import {Select, Option, DatePicker} from 'element-ui'
    import {Validator} from 'vee-validate'

    let default_btn = [
        {
            id: 'save',
            name: '保存',
            icon: 'icon iconfont bd-save-o',
            click: function () {
                let _this = this;
                _this.$refs.mainForm.dataModel['child'] = JSON.stringify(this.dicItems);
                this.validate(function () {
                    _this.$refs.mainForm.validate(function () {
                        let url = `${_this.BASEURL}/jdbc/common/basecommonsave/saveDic.do?mdCode=${_this.module.code}`
                        _this.postFile(url, _this.$refs.mainForm.dataModel, (isSuccess, res) => {
                            if (res.hasOk) {
                                _this.alert('保存成功', 'success')
                                _this.close()
                            } else {
                                _this.alert(`保存失败！${res.message}`)
                            }
                        }, true)
                    });
                });
            }
        }, {
            id: 'close',
            name: '关闭',
            icon: 'icon iconfont bd-times',
            click: function () {
                //this.$parent.close()
                this.close()
            }
        }
    ]

    export default {
        components: {
            ModuleEdit,
            Location,
            ModuleForm,
            [Option.name]: Option,
            [Select.name]: Select,
            [DatePicker.name]: DatePicker,
            [Validator.name]: Validator,
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
                    editedJsObj: {},
                    childTab: {},
                    hasChild: false,
                },
                defaultButtons: default_btn,
                buttons: [],
                childModelValidations: {},
                dicItems: [],
                dicItem: {},
            }
        },
        computed: {
            btnMethod() {
                let obj = {}
                this.buttons.forEach(btn => obj[btn.id] = btn.click)
                return obj
            },
            hasChild() {
                return this.module.hasChild
            },
        },
        methods: {
            genModelValid(field, index) {
                return this.childModelValidations[this.genField(field, index)]
            },
            genField(field, index) {
                return field + index
            },
            validate(callback) {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        callback()
                    }
                })
            },
            async newModuleInfo(mdCode) {
                this.module = await ModuleUtils.editModuleCfg(mdCode)
                if (this.module.childTab.length > 0) {
                    this.module.hasChild = true
                    let child = await ModuleUtils.editModuleCfg(this.module.childTab[0].module)
                    child.relatedField = this.module.childTab[0].relationEntityField
                    this.module.childTab = child;
                    this.module.childTab.fields.forEach(f => {
                        if (f.dic) {
                            this.dicItem[f.name] = 0
                        } else {
                            this.dicItem[f.name] = ''
                        }
                    })
                    this.childEditJSON()
                }
            },
            childEditJSON() {
                let id = this.$route.params.id
                if (id === 'add') {
                    return
                }

                if (id === 'placeholder') {
                    id = ''
                }
                let params = {
                    defaultSearchParam: JSON.stringify([{
                        'name': this.module.childTab.relatedField,
                        'value': id,
                        'type': 'exact-match'
                    }]),
                    mdCode: this.module.childTab.code,
                    usePage: false
                }

                let _url = `${this.INTERFACE.moduleListData}`
                this.post(_url, params, (isSuccess, data) => {
                    data.Rows.forEach(d => {
                        let item = new Object()
                        this.module.childTab.fields.forEach(f => {
                            item[f.name] = d[f.name]
                        })
                        this.dicItems.push(item);
                    });
                }, true)
            },
            close() {
                let returnPath = this.$route.query.data.returnPath
                this.$router.push({
                    path: returnPath
                })
            },
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
            addItem() {
                let newItem = {}
                newItem = Object.assign(newItem, this.dicItem)
                this.$set(this.dicItems, this.dicItems.length, newItem)
            },
            deleteItem(index, event) {
                this.dicItems.splice(index, 1);
            },
            getError(fieldName, index) {
                return this.errors.first(this.genField(fieldName, index))
            },
        },
        created() {
            this.newModuleInfo(this.$route.params.mdCode)
        },
        beforeRouteUpdate(to, from, next) {
            let mdCode = to.params.mdCode
            this.newModuleInfo(mdCode)
            next()
        },
        watch: {
            module: {
                deep: true,
                handler: function () {
                    this.randerBtn(this.module.editedJsObj.editButtons)
                }
            },
            dicItems: {
                deep: false,
                handler: function () {
                    // return
                    let attributes = {}
                    this.dicItems.forEach((d, index) => {
                        this.module.childTab.fields.forEach(f => {
                            let fn = f.name + index;
                            this.childModelValidations[fn] = {};
                            if (f.required) {
                                this.childModelValidations[fn]['required'] = true
                                attributes[fn] = f.display
                            }
                            if (f.unique) {
                                this.childModelValidations[fn]['unique'] = true
                                attributes[fn] = f.display
                            }
                            if (f.validationRule) {
                                this.childModelValidations[fn][f.validationRule] = true
                                attributes[fn] = f.display
                            }
                        })
                    });
                    Validator.localize('zh_CN', {'attributes': attributes})
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

    #childForm div.form-group {
        margin-bottom: 0;
    }
</style>
