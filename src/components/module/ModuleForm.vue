<template>
    <div class="module-form">
        <card>
            <form>
                <div class="row" v-for="(arr, index) in showFields" :key="index">
                    <div :class="item.colClass" v-for="item in arr" :key="item.field.name">
                        <!-- 只读 -->
                        <fg-input v-if="item.field.type === 'readonly'" disabled :label="item.field.display"
                                  :placeholder="item.field.display"
                                  v-model="dataModel[item.field.name]"></fg-input>

                        <!-- 密码 -->
                        <fg-input v-else-if="item.field.type === 'password'" type="password" :label="item.field.display"
                                  :placeholder="item.field.display" v-model="dataModel[item.field.name]"></fg-input>

                        <!-- 下拉框 -->
                        <fg-select
                            v-else-if="item.field.type === 'select'"
                            :label="item.field.display"
                            :placeholder="item.field.display"
                            v-model="dataModel[item.field.name]"
                            @text-change="dataModel[item.field.valueFieldText] = $event"
                            :options="module.dic[item.field.dic]"
                            :moduleField="item.field"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            @change="handerCheckboxAndRadioListChange(item.field, $event)"
                            :error="getError(item.field.name)">
                        </fg-select>

                        <!-- 日期 -->
                        <fg-input
                            v-else-if="item.field.type === 'date'"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)"
                        >
                            <el-date-picker
                                v-model="dataModel[item.field.name]"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择"
                                @change="reValidateField(item.field.name)">
                            </el-date-picker>
                        </fg-input>

                        <!-- 年份 -->
                        <fg-input
                            v-else-if="item.field.type === 'year'"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)"
                        >
                            <el-date-picker
                                v-model="dataModel[item.field.name]"
                                type="year"
                                value-format="yyyy"
                                placeholder="请选择"
                                @change="reValidateField(item.field.name)">
                            </el-date-picker>
                        </fg-input>

                        <!-- 颜色选择器-多选 -->
                        <fg-input
                            v-else-if="item.field.type === 'color-multiple'"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)"
                        >
                            <l-color-picker
                                :fieldName="item.field.name"
                                :colors="dataModel[item.field.name]"
                                :isSingle="false"
                                @setDataFromChild="setDataFromChild"
                            >
                            </l-color-picker>
                        </fg-input>
                        <!-- 颜色选择器-单选 -->
                        <fg-input
                            v-else-if="item.field.type === 'color-single'"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)"
                        >
                            <l-color-picker
                                :fieldName="item.field.name"
                                :colors="dataModel[item.field.name]"
                                :isSingle="true"
                                @setDataFromChild="setDataFromChild"
                            >
                            </l-color-picker>
                        </fg-input>

                        <!-- 图片-多选 -->
                        <fg-input
                            v-else-if="item.field.type === 'img'"
                            :label="item.field.display">
                            <l-attach
                                type='img'
                                :resourceId="id"
                                :fileType='item.field.fileType'
                                :fieldName="item.field.valueFieldId ? item.field.valueFieldId : item.field.name"
                                :fieldTextName="item.field.valueFieldText ? item.field.valueFieldText : ''"
                                :attach="dataModel[item.field.valueFieldId ? item.field.valueFieldId : item.field.name]"
                                :attachName="item.field.valueFieldText ? dataModel[item.field.valueFieldText] : ''"
                                :isSingle="false"
                                @removeAttach="removeAttach(item.field.valueFieldId ? item.field.valueFieldId : item.field.name, $event)"
                                @setAttach="setAttach"
                            >
                            </l-attach>
                        </fg-input>
                        <!-- 图片-单选 -->
                        <fg-input
                            v-else-if="item.field.type === 'imgSingle'"
                            :label="item.field.display">
                            <l-attach
                                type='img'
                                :resourceId="id"
                                :fileType='item.field.fileType'
                                :fieldName="item.field.valueFieldId ? item.field.valueFieldId : item.field.name"
                                :fieldTextName="item.field.valueFieldText ? item.field.valueFieldText : ''"
                                :attach="dataModel[item.field.valueFieldId ? item.field.valueFieldId : item.field.name]"
                                :attachName="item.field.valueFieldText ? dataModel[item.field.valueFieldText] : ''"
                                :isSingle="true"
                                @removeAttach="removeAttach(item.field.valueFieldId ? item.field.valueFieldId : item.field.name, $event)"
                                @setAttach="setAttach"
                            >
                            </l-attach>
                        </fg-input>

                        <!-- 附件 -->
                        <fg-input
                            v-else-if="item.field.type === 'attach'"
                            :label="item.field.display">
                            <l-attach
                                type='attach'
                                :resourceId="id"
                                :fileType='item.field.fileType'
                                :fieldName="item.field.valueFieldId ? item.field.valueFieldId : item.field.name"
                                :fieldTextName="item.field.valueFieldText ? item.field.valueFieldText : ''"
                                :attach="dataModel[item.field.valueFieldId ? item.field.valueFieldId : item.field.name]"
                                :attachName="item.field.valueFieldText ? dataModel[item.field.valueFieldText] : ''"
                                :isSingle="true"
                                @removeAttach="removeAttach(item.field.valueFieldId ? item.field.valueFieldId : item.field.name, $event)"
                                @setAttach="setAttach"
                            >
                            </l-attach>
                        </fg-input>

                        <!-- 地址本 单选 -->
                        <fg-input
                            v-else-if="item.field.type === 'addressbook' && isSingleAddressBook(item.field.addressType)"
                            v-model="dataModel[item.field.valueFieldText]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <form-addressBook-single
                                :name="item.field.valueFieldText"
                                :addressType="item.field.addressType"
                                :field="item.field"
                                :valueId="dataModel[item.field.valueFieldId]"
                                :valueText="dataModel[item.field.valueFieldText]"
                                @change="handerAddressBookChange(item.field, $event)">
                            </form-addressBook-single>
                        </fg-input>

                        <!-- 地址本 多选 -->
                        <fg-input
                            v-else-if="item.field.type === 'addressbook' && !isSingleAddressBook(item.field.addressType)"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <form-addressBook-mult
                                :name="item.field.valueFieldText"
                                :addressType="item.field.addressType"
                                :field="item.field"
                                :valueId="dataModel[item.field.valueFieldId]"
                                :valueText="dataModel[item.field.valueFieldText]"
                                @change="handerAddressBookChange(item.field, $event)">
                            </form-addressBook-mult>
                        </fg-input>

                        <!-- 弹出框列表选择 单选 -->
                        <fg-input
                            v-else-if="item.field.type === 'selectListData'"
                            v-model="dataModel[item.field.valueFieldText]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <form-chooseList-single
                                :name="item.field.valueFieldText"
                                :field="item.field"
                                :dicData="module.dic"
                                :editedJsObj="module.editedJsObj"
                                :valueId="dataModel[item.field.valueFieldId]"
                                :valueText="dataModel[item.field.valueFieldText]"
                                @change="handerChooseListChange(item.field, $event)">
                            </form-chooseList-single>
                        </fg-input>

                        <!-- 弹出框列表选择 多选 -->
                        <fg-input
                            v-else-if="item.field.type === 'selectListDataMulti'"
                            v-model="dataModel[item.field.valueFieldText]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <form-chooseList-mult
                                :name="item.field.valueFieldText"
                                :field="item.field"
                                :dicData="module.dic"
                                :editedJsObj="module.editedJsObj"
                                :valueId="dataModel[item.field.valueFieldId]"
                                :valueText="dataModel[item.field.valueFieldText]"
                                @change="handerChooseListChange(item.field, $event)">
                            </form-chooseList-mult>
                        </fg-input>

                        <!-- CheckboxList -->
                        <fg-input
                            v-else-if="item.field.type === 'checkboxlist'"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <checkbox-list
                                :options="module.dic[item.field.dic]"
                                :moduleField="item.field"
                                :valueId="dataModel[item.field.valueFieldId]"
                                @change="handerCheckboxAndRadioListChange(item.field, $event)">
                            </checkbox-list>
                        </fg-input>

                        <!-- radio -->
                        <fg-input
                            v-else-if="item.field.type === 'radio'"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <radio-list
                                :options="module.dic[item.field.dic]"
                                :moduleField="item.field"
                                :valueId="dataModel[item.field.valueFieldId]"
                                @change="handerCheckboxAndRadioListChange(item.field, $event)">
                            </radio-list>
                        </fg-input>

                        <!-- checkbox -->
                        <fg-input
                            v-else-if="item.field.type === 'checkbox'"
                            v-model="dataModel[item.field.name]"
                            :label="item.field.display"
                            :name="item.field.name"
                            :required="item.field.required"
                            v-validate="modelValidations[item.field.name]"
                            :error="getError(item.field.name)">
                            <div>
                                <l-switch v-model="dataModel[item.field.name]"></l-switch>
                            </div>
                        </fg-input>

                        <!-- textarea -->
                        <fg-input v-else-if="item.field.type === 'textarea'" :label="item.field.display"
                                  :placeholder="item.field.display" :name="item.field.name"
                                  :required="item.field.required" v-validate="modelValidations[item.field.name]"
                                  :error="getError(item.field.name)"
                                  v-model="dataModel[item.field.name]">
                            <textarea
                                class="form-control"
                                :placeholder="item.field.display"
                                v-model="dataModel[item.field.name]"
                                @keydown="reValidateField(item.field.name)">
                            </textarea>
                        </fg-input>

                        <fg-input v-else-if="item.field.type === 'richText'" :label="item.field.display"
                                  :placeholder="item.field.display" :name="item.field.name"
                                  :required="item.field.required" v-validate="modelValidations[item.field.name]"
                                  :error="getError(item.field.name)"
                                  v-model="dataModel[item.field.name]">
                            <rich-text v-model="dataModel[item.field.name]"
                                       :customCfg="_UECustomCfg(item.field.name)"
                                       @input="reValidateField(item.field.name)"></rich-text>
                        </fg-input>

                        <!-- 文本框 -->
                        <fg-input v-else :label="item.field.display" :placeholder="item.field.display"
                                  :name="item.field.name"
                                  :required="item.field.required" v-validate="modelValidations[item.field.name]"
                                  :error="getError(item.field.name)"
                                  v-model="dataModel[item.field.name]"></fg-input>
                    </div>
                </div>
            </form>
        </card>

        <card v-if="attachMultiFields.length > 0">
            <attach-list
                v-for="f in attachMultiFields"
                :key="f.id"
                :resourceId="id"
                :title="f.display"
                :config="getAttachConfig(f.name)"
                v-model="dataModel[f.name]"
                @removeAttach="removeAttach(f.name, $event)">
            </attach-list>
        </card>
    </div>
</template>

<script>
    import {Select, Option, DatePicker} from 'element-ui'
    import formGroupSelect from '../Inputs/formGroupSelect'
    import ColorPickerJq from '../Inputs/ColorPickerJq'
    import Attach from '../Inputs/Attach'
    import AttachList from './AttachList'
    import {Validator} from 'vee-validate'
    import FormAddressBookSingle from "../Inputs/formAddressBookSingle"
    import FormAddressBookMult from "../Inputs/formAddressBookMult"
    import FormChooseListSingle from "../Inputs/formChooseListSingle"
    import FormChooseListMult from "../Inputs/formChooseListMult"
    import CheckBoxList from '../Inputs/CheckboxList'
    import RadioList from '../Inputs/RadioList'
    import Switch from '../Switch'
    import RichText from '../Inputs/RichText'

    export default {
        name: "module-form",
        components: {
            [Option.name]: Option,
            [Select.name]: Select,
            [formGroupSelect.name]: formGroupSelect,
            [DatePicker.name]: DatePicker,
            [ColorPickerJq.name]: ColorPickerJq,
            [Attach.name]: Attach,
            [AttachList.name]: AttachList,
            [FormAddressBookSingle.name]: FormAddressBookSingle,
            [FormAddressBookMult.name]: FormAddressBookMult,
            [FormChooseListSingle.name]: FormChooseListSingle,
            [FormChooseListMult.name]: FormChooseListMult,
            [Validator.name]: Validator,
            [CheckBoxList.name]: CheckBoxList,
            [RadioList.name]: RadioList,
            [Switch.name]: Switch,
            [RichText.name]: RichText
        },
        props: {
            module: {
                type: Object,
                required: true
            },
            column: {
                type: Number,
                default: 2
            }
        },
        data() {
            return {
                dataModel: {},
                tagCode: '',
                id: '',
                modelValidations: {},
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{'header': 1}, {'header': 2}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}],
                            [{'indent': '-1'}, {'indent': '+1'}],
                            [{'direction': 'rtl'}],
                            [{'size': ['small', false, 'large', 'huge']}],
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            [{'font': []}],
                            [{'color': []}, {'background': []}],
                            [{'align': []}],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        history: {
                            delay: 1000,
                            maxStack: 50,
                            userOnly: false
                        },
                        imageDrop: true,
                        imageResize: {
                            displayStyles: {
                                backgroundColor: 'black',
                                border: 'none',
                                color: 'white'
                            },
                            modules: ['Resize', 'DisplaySize', 'Toolbar']
                        }
                    }
                }
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
                outter:
                while (i < fields.length) {
                    let arr = []
                    for (let j = 0; j < this.column && i < fields.length; j++) {
                        let f = fields[i++]
                        if (f.isFullLine === 1) {
                            // 单独一行
                            result.push(arr)
                            result.push([{field: f, colClass: this._colClass(1)}])
                            continue outter
                        }
                        arr.push({field: f, colClass: this._colClass()})
                    }
                    result.push(arr)
                }
                return result
            },
            attachMultiFields() {
                let fields = this.module.fields.filter(f => f.type === 'attachMulti')
                return fields
            },
        },
        methods: {
            editJSON(recordId) {
                this.id = recordId || this.$route.params.id || this.$route.query.id
                if (this.id === 'add' || this.id === 'placeholder') {
                    this.id = ''
                    return
                }

                if (this.id && this.id.toLowerCase() === 'nullstr') {
                    this.id = ''
                }

                let _url = `${this.BASEURL}/jdbc/common/basecommonedit/editJSON.do`
                let customUrl = false
                if (this.module.editedJsObj.editJSONUrl) {
                    _url = this.BASEURL + this.module.editedJsObj.editJSONUrl
                    customUrl = true
                }

                // 没有id，并且不是自定义url时，不需要查询数据
                if (!this.id && !customUrl) {
                    return
                }

                let params = {
                    id: this.id,
                    mdCode: this.module.code
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
                    this.$set(this.dataModel, 'deleteAttach', '{}')
                    if (!this.id) {
                        this.id = this.dataModel['id']
                    }

                    if (this.id && !this.dataModel['id']) {
                        this.dataModel['id'] = this.id
                    }
                }, true)
                console.info(this.dataModel)
            },
            setData(key, value) {
                this.$set(this.dataModel, key, value)
            },
            clearData() {
                for (let key in this.dataModel) {
                    this.dataModel[key] = ''
                }
            },
            /*
            给子组件赋值用,适用于那些触发不了input和change的特殊子组件
            json: {fieldName: value}
            */
            setDataFromChild(json) {
                if (!json) return
                for (var key in json) {
                    this.dataModel[key] = json[key];
                }
            },
            /**
             *
             * @param {String} field 附件属性的属性名
             * @param {Array} attachIds 需要删除的附件id
             */
            removeAttach(field, attachIds) {
                let deleteAttach = JSON.parse(this.dataModel['deleteAttach']);
                attachIds.forEach(id => {
                    if (deleteAttach[field]) deleteAttach[field] += `,${id}`
                    else deleteAttach[field] = id
                })
                this.dataModel['deleteAttach'] = JSON.stringify(deleteAttach)
            },
            /*
             附件上传类调用的方法:记录下要上传的附件
             json: {fieldName: attachArr}
             */
            setAttach(json) {
                if (!json) return
                for (var key in json) {
                    this.dataModel[key] = json[key];
                }
            },
            renValidator() {
                let attributes = {}, hasField = false;
                this.module.fields.forEach((f, index) => {
                    let rules = {}
                    // 处理字段的验证规则
                    let unique = false
                    if (f.validationRule) {
                        let arr = f.validationRule.split(';')
                        arr.forEach(r => {
                            if (r === 'unique') {
                                unique = true
                            } else if (r === 'required') {
                                // f 中的 required 属性控制是否显示星号，这里把它更新为true
                                f.required = true
                            } else if (r.indexOf('=') === -1) {
                                rules[r] = true
                            } else {
                                let tmp = r.split('=')
                                rules[tmp[0]] = tmp[1]
                            }
                        })
                    }

                    // 必填
                    if (f.required) {
                        rules.required = true
                    }

                    // 字符串最大长度
                    if (!rules.max && f.maxlength) {
                        rules.max = f.maxlength
                    }

                    // 唯一校验
                    if (unique || f.unique) {
                        let vName = 'unique-' + index
                        this.addUniqueValidator(vName, f)
                        rules[vName] = true
                    }

                    attributes[f.name] = f.display
                    this.modelValidations[f.name] = rules
                })
                Validator.localize('zh_CN', {'attributes': attributes})
            },
            addUniqueValidator(vName, field) {
                let url = this.INTERFACE.validUnique
                let params = {
                    id: this.id,
                    mdCode: this.module.code,
                    key: field.name
                }
                Validator.extend(vName, {
                    getMessage: fieldName => fieldName + '已存在',
                    validate: value => {
                        let resolve
                        params.value = value
                        this.get(url, params, (isSuccess, exist) => {
                            resolve({
                                valid: !exist
                            })
                        }, true)
                        return new Promise(r => resolve = r)
                    }
                })
            },
            getError(fieldName) {
                return this.errors.first(fieldName)
            },
            validate(callback) {
                this.$validator.validateAll().then(valid => {
                    if (valid) {
                        callback()
                    }
                })
            },
            getAttachConfig(fieldName) {
                let fieldOptions = this.module.editedJsObj.fieldOptions
                if (!fieldOptions || !fieldOptions[fieldName] || !fieldOptions[fieldName].config) {
                    return {}
                }
                return fieldOptions[fieldName].config
            },
            /**
             * 处理单选地址本 change 事件
             */
            handerAddressBookChange(field, result) {
                this.setData(field.valueFieldText, result.text)
                this.setData(field.valueFieldId, result.id)

                let obj = this.module.editedJsObj
                if (obj && obj.fieldOptions && obj.fieldOptions[field.name]
                    && obj.fieldOptions[field.name].addressBookCallback) {
                    obj.fieldOptions[field.name].addressBookCallback.call(this, this.dataModel, result)
                }
                this.reValidateField(field.name)
            },
            /**
             * 判断是否为单选的地址本，是返回true，否则返回false
             */
            isSingleAddressBook(addressType) {
                if (!addressType) {
                    return false
                }
                let arr = addressType.split('-')
                if (arr.length < 2) {
                    return false
                }
                return arr[1] === '1'
            },
            /**
             * 处理单选列表选择框 change 事件
             */
            handerChooseListChange(field, result) {
                this.setData(field.valueFieldId, result.id)
                this.setData(field.valueFieldText, result.text)

                let obj = this.module.editedJsObj
                if (obj && obj.fieldOptions && obj.fieldOptions[field.name]
                    && obj.fieldOptions[field.name].chooseListCallback) {
                    obj.fieldOptions[field.name].chooseListCallback.call(this, this.dataModel, result)
                }
                this.reValidateField(field.name)
            },
            /**
             * 触发字段的验证
             */
            reValidateField(field) {
                setTimeout(() => this.$validator.validate(field))
            },
            setDefaultValue() {
                if (this.module && this.module.fields) {
                    this.module.fields.filter(f => f.defaultValue).forEach(f => this.setData(f.name, f.defaultValue))
                }
            },
            handerCheckboxAndRadioListChange(f, result) {
                this.setData(f.valueFieldText, result.text)
                this.setData(f.valueFieldId, result.id)
                this.reValidateField(f.name)
            },
            _colClass(clumnNum) {
                if (!clumnNum) {
                    clumnNum = this.column
                }
                if (clumnNum === 2) {
                    return 'col-lg-6'
                } else if (clumnNum === 3) {
                    return 'col-lg-4'
                } else {
                    return 'col-lg-12'
                }
            },
            _UECustomCfg(fieldName) {
                let obj = this.module.editedJsObj
                if (obj.fieldOptions && obj.fieldOptions[fieldName] && obj.fieldOptions[fieldName].ueditorCfg) {
                    return obj.fieldOptions[fieldName].ueditorCfg
                }
                return null
            }
        },
        watch: {
            module: {
                deep: true,
                immediate: true,
                handler: function () {
                    if (!this.module || !this.module.code) {
                        return
                    }
                    this.setDefaultValue()
                    this.editJSON();
                    this.renValidator();
                }
            }
        },
    }
</script>

<style scoped>
    .card {
        margin-bottom: 10px;
    }

    .module-form >>> .ql-editor {
        min-height: 100px;
    }
</style>
