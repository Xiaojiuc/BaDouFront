<template>
    <div>
        <card>
            <form>
                <div class="row" v-for="(item, index) in showFields" :key="index">
                    <div :class="colClass" v-for="f in item" :key="f.name">
                        <!-- 文本框 -->
                        <fg-input v-if="f.type === 'text'" :label="f.display" :placeholder="f.display" :name="f.name"
                                  :required="f.required" v-validate="modelValidations[f.name]" :error="getError(f.name)"
                                  v-model="dataModel[f.name]"></fg-input>

                        <!-- 只读 -->
                        <fg-input v-if="f.type === 'readonly'" disabled :label="f.display" :placeholder="f.display"
                                  v-model="dataModel[f.name]"></fg-input>

                        <!-- 环节处理人 -->                        
                        <fg-input @click="chooseHandler($event)" v-if="f.name === 'nodeProcessorText'" :placeholder="f.display" readonly :label="f.display" :name="f.name" v-model="dataModel[f.name]"
                        :valueFieldId="f.valueFieldId"
                        :valueFieldText="f.valueFieldText"
                        >
                        </fg-input>

                        <!-- 抄送人 -->
                        <fg-input @click="chooseHandler($event)" v-show="dataModel['flgSpread'] === '1'" v-if="f.name === 'spreadProcessorText'" :placeholder="f.display" readonly :label="f.display" :name="f.name" v-model="dataModel[f.name]"
                        :valueFieldId="f.valueFieldId"
                        :valueFieldText="f.valueFieldText"
                        >
                        </fg-input>

                        <!-- 界面展示方式 -->
                        <fg-input @click="chooseView($event)" v-if="f.name === 'viewName'" :placeholder="f.display" readonly :label="f.display" :name="f.name" v-model="dataModel[f.name]"
                        :valueFieldId="f.valueFieldId"
                        :valueFieldText="f.valueFieldText"
                        >
                        </fg-input>

                        <!-- 密码 -->
                        <fg-input v-if="f.type === 'password'" type="password" :label="f.display"
                                  :placeholder="f.display" v-model="dataModel[f.name]"></fg-input>

                        <!-- 下拉框 -->
                        <fg-select
                            v-if="normalSelect(f.type, f.mdCode)"
                            :label="f.display"
                            :placeholder="f.display"
                            v-model="dataModel[f.name]"
                            @text-change="dataModel[f.valueFieldText] = $event"
                            :options="module.dic[f.dic]"
                            :name="f.name"
                            :moduleField="f"
                            :required="f.required"
                            v-validate="modelValidations[f.name]"
                            :error="getError(f.name)">
                        </fg-select>
                        <!-- 下拉框，业务类型 -->
                        <div class="form-group" v-if="f.name === 'busiType'">
                            <el-select  class="select-default" size="large" v-model="dataModel[f.name]" :name="f.name" placeholder="请选择">
                                <el-option
                                    v-for="d in busiType"
                                    :key="d.id"
                                    :label="d.text"
                                    :value="d.id"
                                    class="select-default"
                                >
                                </el-option>
                            </el-select>  
                        </div>
                                                  

                        <!-- 下拉框，目标节点 -->
                        <div v-if="f.name === 'nextNodeId'" class="form-group">
                            <label>
                                  目标环节
                                  <span style="color: red;">*</span>
                            </label>
                            <table style='text-align: center; border: none; width: 100%;'>
                                <tr>
                                    <td>
                                        <el-select
                                            :placeholder="f.display"
                                            v-model="dataModel[f.name]"
                                            :options="busiType"
                                            class="select-default" size="large" 
                                            :name="f.name"
                                            required
                                            v-validate="modelValidations[f.name]"
                                            :error="getError(f.name)">
                                            <el-option
                                                v-for="d in busiType"
                                                :key="d.id"
                                                :label="d.text"
                                                :value="d.id"
                                                class="select-default"
                                            >
                                            </el-option>
                                        </el-select> 
                                    </td>
                                    <td v-if="dataModel['flgMultiNode'] === '1' || dataModel['flgMultiNode'] === '2'">
                                        <el-button 
                                        plain 
                                        @click.prevent="addNextNode"
                                        style="margin-left: 4px; margin-bottom: 4px;"
                                        >添加
                                        </el-button>   
                                    </td>
                                </tr>
                                <!-- 多目标路由 -->
                                <tr v-for="node,index in nodeItems">
                                    <td>
                                        <el-select
                                            placeholder="目标环节"
                                            v-model="node['nextNodeId']"
                                            :options="busiType"
                                            class="select-default" size="large" 
                                            :name="genNextNodeId(index)"
                                            required
                                            v-validate="genModelValid(index)"
                                            :error="getError2(index)">
                                            <el-option
                                                v-for="d in busiType"
                                                :key="d.id"
                                                :label="d.text"
                                                :value="d.id"
                                                class="select-default"
                                            >
                                            </el-option>
                                        </el-select> 
                                    </td>
                                    <td>
                                        <el-button 
                                        plain 
                                        @click.prevent="deleteNextNode(index)"
                                        style="margin-left: 4px; margin-bottom: 4px;"
                                        >删除
                                        </el-button>   
                                    </td>

                                </tr>
                            </table>
            
                        </div>


                        <!-- 日期 -->
                        <fg-input
                            v-if="f.type === 'date'"
                            :label="f.display"
                            :name="f.name"
                            :required="f.required"
                            v-validate="modelValidations[f.name]"
                            :error="getError(f.name)"
                        >
                            <el-date-picker
                                v-model="dataModel[f.name]"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择">
                            </el-date-picker>
                        </fg-input>
                    </div>
                </div>
            </form>
        </card>
    </div>
</template>

<script>
    import {Select, Option, DatePicker} from 'element-ui'

    import formGroupSelect from 'src/components/Inputs/formGroupSelect'

    import {Validator} from 'vee-validate'

    export default {
        name: "flwflow-form",
        components: {
            [Option.name]: Option,
            [Select.name]: Select,
            [formGroupSelect.name]: formGroupSelect,
            [DatePicker.name]: DatePicker,
            [Validator.name]: Validator,
        },
        props: {
            module: {
                type: Object,
                required: true
            },
            column: {
                type: Number,
                default: 2
            },
        },
        data() {
            return {
                dataModel: {},
                tagCode: '',
                id: this.$route.params.id,
                modelValidations: {},
                busiType: [],   /* 业务类型、目标节点下拉框的数据 */
                nodeItems: [],  /* 多目标路由时，存放的目标路由集合 */
            }
        },
        computed: {
            showFields() {
                let fields = this.module.fields.filter(f => f.type !== 'hidden' && f.type !== 'attachMulti')

                if (!fields) {
                    return []
                }

                let result = []
                let i = 0
                while (i < fields.length) {
                    let arr = []
                    for (let j = 0; j < this.column && i < fields.length; j++) {
                        arr.push(fields[i++])
                    }
                    result.push(arr)
                }
                //this.loadOptions()
                return result
            },
            colClass() {
                if (this.column === 2) {
                    return 'col-lg-6'
                } else if (this.column === 3) {
                    return 'col-lg-4'
                } else {
                    return 'col-lg-12'
                }
            }
        },
        methods: {
            /* 添加目标环节 */
            addNextNode() {
                this.$set(this.nodeItems, this.nodeItems.length, {'nextNodeId': this.busiType[0].id})
            },
            /* 删除目标环节 */
            deleteNextNode(index) {
                this.nodeItems.splice(index, 1)
            },
            /* 返回目标节点字段加上索引 */
            genNextNodeId(index) {
                return 'nextNodeId' + index
            },
            /* 根据字段+索引获得校验参数 */
            genModelValid(index) {
                return this.modelValidations[this.genNextNodeId(index)]
            },
            /* 处理人选择地址本弹框 */
            chooseHandler(event) {
                let _this = this
                this.addressBook({
                    type: '1024;2',     /* 1024：抽象处理人，   2：组织架构 */
                    selectType: [20,100]    /* 100：抽象处理人    20：组织架构 */
                }).then(data => {
                    let value = ''
                    let text = ''
                    for (let i = 0; i < data.length; i++) {
                        if (i === data.length - 1) {
                            value += data[i].value
                            text += data[i].name
                        } else {
                            value = value + data[i].value + ','
                            text = text + data[i].name + ','
                        }
                    }
                    this.dataModel[event.target.getAttribute('valueFieldId')] = value
                    this.dataModel[event.target.getAttribute('valueFieldText')] = text
                })
            },
            /* 视图选择弹窗 */
            chooseView() {
                this.$parent.$parent.setViewModuleInfo()
                this.$parent.$parent.config.dialogVisible = true
            },
            /* 普通的，以数据字典为下拉框选项的下拉框 */
            normalSelect(type, mdCode) {
                if (type === 'select' && !mdCode) {
                    return true
                }
                return false
            },
            editJSON() {
                if (this.$parent.$parent.currentNodeId === 'ROOT') {
                    this.id = this.$route.params.id
                } else {
                    this.id = this.$parent.$parent.currentNodeId
                }
                if (this.id === 'add' || this.id === 'placeholder') {
                    this.id = ''
                    return
                }

                if (this.id === 'nullStr') {
                    this.id = ''
                }

                let params = {
                    id: this.id,
                    mdCode: this.module.code
                }

                let _url = `${this.BASEURL}/jdbc/common/basecommonedit/editJSON.do`
                let customUrl = false
                if (this.module.editedJsObj.editJSONUrl) {
                    _url = this.BASEURL + this.module.editedJsObj.editJSONUrl
                    customUrl = true
                }
                this.get(_url, params, (isSuccess, data) => {
                    this.module.fields.forEach(f => {
                        let value
                        if (customUrl) {
                            value = typeof data[f.name] !== 'undefined' ? data[f.name] : ''
                        } else {
                            value = typeof data[f.name] !== 'undefined' && data[f.name].value !== null ? data[f.name].value : ''
                        }
                        this.$set(this.dataModel, f.name, String(value)) // 数字也需要转成字符,不然select的可能不回显,底层判断可能为===
                    })
                    if (!this.id) {
                        this.id = this.dataModel['id']
                    }
                    /* 如果是多路由，则处理多路由目标节点数据 */
                    if (data.flgMultiNode && (data.flgMultiNode.value === '1' || data.flgMultiNode.value === '2') && data.nextNodeIds && data.nextNodeIds.value) {
                        let nodeItms = []
                        data.nextNodeIds.value.split(',').filter(n => n !== data.nextNodeId.value).forEach(nd => {
                            nodeItms.push({'nextNodeId': nd})
                        })
                        this.nodeItems = nodeItms

                    }
                }, true)
                
            },
            /*加载模型数据，渲染成option格式*/
            loadOptions(mdCode, params) {
                if (!mdCode) {
                    return
                }
                let url = `${this.INTERFACE.moduleListData}?mdCode=` + mdCode
                this.post(url, params, (isSuccess, data) => {
                    if (data.Rows.length > 0) {
                        let options = []
                        data.Rows.forEach(d => {
                            let op = {'id': d.idd ? d.idd : d.id, 'text': d.name}
                            options.push(op)
                        })
                        this.busiType = options
                    }
                }, true)
            },
            setData(key, value) {
                this.$set(this.dataModel, key, value)
            },
            renValidator() {
                let attributes = {};
                this.module.fields.forEach(f => {
                    this.modelValidations[f.name] = {};
                    if (f.required) {
                        this.modelValidations[f.name]['required'] = true
                        attributes[f.name] = f.display
                    }
                    if (f.unique) {
                        this.modelValidations[f.name]['unique'] = true
                        attributes[f.name] = f.display
                    }
                    if (f.validationRule) {
                        this.modelValidations[f.name][f.validationRule] = true
                        attributes[f.name] = f.display
                    }
                })
                Validator.localize('zh_CN', {'attributes': attributes})
            },
            getError(fieldName) {
                return this.errors.first(fieldName)
            },
            getError2(index) {
                return this.errors.first(this.genNextNodeId(index))
            },
            validate(callback) {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        callback()
                    }
                })
            }
        },
        // 校验规则
        created() {
            Validator.extend('unique', {
                getMessage: (field) => field + '已存在',
                validate: (value) => {
                    // 发送请求去验证 value 值是否唯一，在这里无法获取到当前验证属性的属性名
                    // 就无法判断是需要验证的是那个属性
                    return true
                }
            })
        },
        beforeUpdate() {
            if ((!this.dataModel['nextNodeId'])
                    && this.module.code === this.$parent.$parent.routeMdCode
                    && this.busiType.length > 0) {
                this.$set(this.dataModel, 'nextNodeId', this.busiType[0].id)
            }
        },
        watch: {
            module: {
                deep: true,
                handler: function () {
                    this.editJSON();
                    this.renValidator();
                }
            },
            nodeItems: {
                deep: false,
                handler: function () {
                    // return
                    let attributes = {}
                    this.nodeItems.forEach((d, index) => {
                        let fn = 'nextNodeId' + index
                        this.modelValidations[fn] = {'required': true}
                        attributes[fn] = '目标环节'
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
</style>
