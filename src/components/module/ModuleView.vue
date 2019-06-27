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
            v-model="activeTabName">
            <!-- 主表数据 -->
            <el-tab-pane :label="module.name" name="main">
                <template>
                    <div>
                        <card>
                            <div class="row" v-for="(arr, index) in showFields" :key="index">
                                <div :class="item.colClass" v-for="item in arr" :key="item.field.name">
                                    <!-- 只读 -->
                                    <fg-input v-if="item.field.type === 'readonly'" disabled :label="item.field.display"
                                              :placeholder="item.field.display"
                                              v-model="dataModel[item.field.name]"></fg-input>

                                    <!-- 密码 -->
                                    <fg-input readonly v-else-if="item.field.type === 'password'" type="password"
                                              :label="item.field.display"
                                              :placeholder="item.field.display" v-model="dataModel[item.field.name]"></fg-input>

                                    <!-- 下拉框 -->
                                    <fg-select
                                        v-else-if="item.field.type === 'select'"
                                        :label="item.field.display"
                                        :moduleField="item.field"
                                        :isView="true"
                                        :options="module.dic[item.field.dic]"
                                        :placeholder="item.field.display"
                                        v-model="dataModel[item.field.name]"
                                        :name="item.field.name">
                                    </fg-select>

                                    <!-- 日期 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'date'"
                                        v-model="dataModel[item.field.name]"
                                        :label="item.field.display"
                                        readonly
                                        :name="item.field.name"
                                    >
                                    </fg-input>

                                    <!-- 年份 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'year'"
                                        v-model="dataModel[item.field.name]"
                                        :label="item.field.display"
                                        :name="item.field.name"
                                        readonly
                                        :required="item.field.required"
                                    >
                                    </fg-input>

                                    <!-- 颜色选择器-多选 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'color-multiple'"
                                        :label="item.field.display"
                                        :name="dataModel[item.field.name]"
                                        v-model="dataModel[item.field.name]"
                                        readonly
                                        :required="item.field.required"
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
                                        v-model="dataModel[item.field.name]"
                                        readonly
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
                                            :disable="true"
                                            :resourceId="id"
                                            :fileType='item.field.fileType'
                                            :fieldName="item.field.valueFieldId ? item.field.valueFieldId : item.field.name"
                                            :fieldTextName="item.field.valueFieldText ? item.field.valueFieldText : ''"
                                            :attach="dataModel[item.field.valueFieldId ? item.field.valueFieldId : item.field.name]"
                                            :attachName="item.field.valueFieldText ? dataModel[item.field.valueFieldText] : ''"
                                            :isSingle="false"
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
                                        >
                                        </l-attach>
                                    </fg-input>

                                    <!-- 地址本 单选 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'addressbook' && isSingleAddressBook(item.field.addressType)"
                                        v-model="dataModel[item.field.valueFieldText]"
                                        :label="item.field.display"
                                        readonly
                                        :name="item.field.name">
                                    </fg-input>

                                    <!-- 地址本 多选 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'addressbook' && !isSingleAddressBook(item.field.addressType)"
                                        v-model="dataModel[item.field.valueFieldText]"
                                        :label="item.field.display"
                                        :name="item.field.name"
                                        readonly
                                    >
                                    </fg-input>

                                    <!-- 弹出框列表选择 单选 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'selectListData'"
                                        v-model="dataModel[item.field.valueFieldText]"
                                        :label="item.field.display"
                                        :name="item.field.name"
                                        readonly
                                    >
                                    </fg-input>


                                    <!-- 弹出框列表选择 多选 -->
                                    <fg-input
                                        v-else-if="item.field.type === 'selectListDataMulti'"
                                        v-model="dataModel[item.field.valueFieldText]"
                                        :label="item.field.display"
                                        readonly
                                        :name="item.field.name">
                                    </fg-input>

                                    <!-- CheckboxList -->
                                    <fg-input
                                        v-else-if="item.field.type === 'checkboxlist'"
                                        v-model="dataModel[item.field.name]"
                                        :label="item.field.display"
                                        :name="item.field.name">
                                        <checkbox-list
                                            :options="module.dic[item.field.dic]"
                                            :moduleField="item.field"
                                            :isView="true"
                                            :valueId="dataModel[item.field.valueFieldId]">
                                        </checkbox-list>
                                    </fg-input>

                                    <!-- radio -->
                                    <fg-input
                                        v-else-if="item.field.type === 'radio'"
                                        v-model="dataModel[item.field.name]"
                                        :label="item.field.display"
                                        readonly
                                        :name="item.field.name">
                                        <radio-list
                                            :options="module.dic[item.field.dic]"
                                            :moduleField="item.field"
                                            :isView="true"
                                            :valueId="dataModel[item.field.valueFieldId]">
                                        </radio-list>
                                    </fg-input>

                                    <!-- checkbox -->
                                    <fg-input
                                        v-else-if="item.field.type === 'checkbox'"
                                        v-model="dataModel[item.field.name]"
                                        :label="item.field.display"
                                        :name="item.field.name"
                                        :required="item.field.required">
                                        <div>
                                            <l-switch :isView="true" v-model="dataModel[item.field.name]"></l-switch>
                                        </div>
                                    </fg-input>

                                    <!-- textarea -->
                                    <fg-input readonly v-else-if="item.field.type === 'textarea'" :label="item.field.display"
                                              :placeholder="item.field.display" :name="item.field.name"
                                              v-model="dataModel[item.field.name]">
                                            <textarea
                                                class="form-control"
                                                readonly
                                                :placeholder="item.field.display"
                                                v-model="dataModel[item.field.name]">
                                            </textarea>
                                    </fg-input>

                                    <!-- 富文本 -->
                                    <fg-input v-else-if="item.field.type === 'richText'" :label="item.field.display"
                                              :placeholder="item.field.display" :name="item.field.name"
                                              v-model="dataModel[item.field.name]">
                                        <rich-text v-model="dataModel[item.field.name]" :isView="true"></rich-text>
                                    </fg-input>

                                    <!-- 文本框 -->
                                    <fg-input v-else readonly :label="item.field.display" :placeholder="item.field.display" :name="item.field.name"
                                              v-model="dataModel[item.field.name]"></fg-input>
                                </div>
                            </div>
                        </card>

                        <card v-if="attachMultiFields.length > 0">
                            <attach-list
                                v-for="f in attachMultiFields"
                                :key="f.id"
                                :resourceId="id"
                                :title="f.display"
                                v-model="dataModel[f.name]">
                            </attach-list>
                        </card>
                    </div>
                </template>
            </el-tab-pane>
            <el-tab-pane
                v-for="(item, index) in childrenTab" :key="index"
                :label="item.displayName"
                :name="index + ''">
                <child-module-view
                    :moduleLink="item"
                    :recordId="recordId">
                </child-module-view>
            </el-tab-pane>
        </el-tabs>

        <template v-else>
            <div>
                <card>
                    <div class="row" v-for="(arr, index) in showFields" :key="index">
                        <div :class="item.colClass" v-for="item in arr" :key="item.field.name">
                            <!-- 只读 -->
                            <fg-input v-if="item.field.type === 'readonly'" disabled :label="item.field.display" :placeholder="item.field.display"
                                      v-model="dataModel[item.field.name]"></fg-input>

                            <!-- 密码 -->
                            <fg-input readonly v-else-if="item.field.type === 'password'" type="password" :label="item.field.display"
                                      :placeholder="item.field.display" v-model="dataModel[item.field.name]"></fg-input>

                            <!-- 下拉框 -->
                            <fg-select
                                v-else-if="item.field.type === 'select'"
                                :label="item.field.display"
                                :moduleField="item.field"
                                :isView="true"
                                :options="module.dic[item.field.dic]"
                                :placeholder="item.field.display"
                                v-model="dataModel[item.field.name]"
                                :name="item.field.name">
                            </fg-select>

                            <!-- 日期 -->
                            <fg-input
                                v-else-if="item.field.type === 'date'"
                                v-model="dataModel[item.field.name]"
                                :label="item.field.display"
                                readonly
                                :name="item.field.name"
                            >
                            </fg-input>

                            <!-- 年份 -->
                            <fg-input
                                v-else-if="item.field.type === 'year'"
                                v-model="dataModel[item.field.name]"
                                :label="item.field.display"
                                :name="item.field.name"
                                readonly
                                :required="item.field.required"
                            >
                            </fg-input>

                            <!-- 颜色选择器-多选 -->
                            <fg-input
                                v-else-if="item.field.type === 'color-multiple'"
                                :label="item.field.display"
                                :name="dataModel[item.field.name]"
                                v-model="dataModel[item.field.name]"
                                readonly
                                :required="item.field.required"
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
                                v-model="dataModel[item.field.name]"
                                readonly
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
                                    :disable="true"
                                    :resourceId="id"
                                    :fileType='item.field.fileType'
                                    :fieldName="item.field.valueFieldId ? item.field.valueFieldId : item.field.name"
                                    :fieldTextName="item.field.valueFieldText ? item.field.valueFieldText : ''"
                                    :attach="dataModel[item.field.valueFieldId ? item.field.valueFieldId : item.field.name]"
                                    :attachName="item.field.valueFieldText ? dataModel[item.field.valueFieldText] : ''"
                                    :isSingle="false"
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
                                >
                                </l-attach>
                            </fg-input>

                            <!-- 地址本 单选 -->
                            <fg-input
                                v-else-if="item.field.type === 'addressbook' && isSingleAddressBook(item.field.addressType)"
                                v-model="dataModel[item.field.valueFieldText]"
                                :label="item.field.display"
                                readonly
                                :name="item.field.name">
                            </fg-input>

                            <!-- 地址本 多选 -->
                            <fg-input
                                v-else-if="item.field.type === 'addressbook' && !isSingleAddressBook(item.field.addressType)"
                                v-model="dataModel[item.field.valueFieldText]"
                                :label="item.field.display"
                                :name="item.field.name"
                                readonly
                            >
                            </fg-input>

                            <!-- 弹出框列表选择 单选 -->
                            <fg-input
                                v-else-if="item.field.type === 'selectListData'"
                                v-model="dataModel[item.field.valueFieldText]"
                                :label="item.field.display"
                                :name="item.field.name"
                                readonly
                            >
                            </fg-input>

                            <!-- 弹出框列表选择 多选 -->
                            <fg-input
                                v-else-if="item.field.type === 'selectListDataMulti'"
                                v-model="dataModel[item.field.valueFieldText]"
                                :label="item.field.display"
                                readonly
                                :name="item.field.name">
                            </fg-input>

                            <!-- CheckboxList -->
                            <fg-input
                                v-else-if="item.field.type === 'checkboxlist'"
                                v-model="dataModel[item.field.name]"
                                :label="item.field.display"
                                :name="item.field.name">
                                <checkbox-list
                                    :options="module.dic[item.field.dic]"
                                    :moduleField="item.field"
                                    :isView="true"
                                    :valueId="dataModel[item.field.valueFieldId]">
                                </checkbox-list>
                            </fg-input>

                            <!-- radio -->
                            <fg-input
                                v-else-if="item.field.type === 'radio'"
                                v-model="dataModel[item.field.name]"
                                :label="item.field.display"
                                readonly
                                :name="item.field.name">
                                <radio-list
                                    :options="module.dic[item.field.dic]"
                                    :moduleField="item.field"
                                    :isView="true"
                                    :valueId="dataModel[item.field.valueFieldId]">
                                </radio-list>
                            </fg-input>

                            <!-- checkbox -->
                            <fg-input
                                v-else-if="item.field.type === 'checkbox'"
                                v-model="dataModel[item.field.name]"
                                :label="item.field.display"
                                :name="item.field.name">
                                <div>
                                    <l-switch :isView="true" v-model="dataModel[item.field.name]"></l-switch>
                                </div>
                            </fg-input>

                            <!-- textarea -->
                            <fg-input readonly v-else-if="item.field.type === 'textarea'" :label="item.field.display"
                                      :placeholder="item.field.display" :name="item.field.name"
                                      v-model="dataModel[item.field.name]">
                                    <textarea
                                        class="form-control"
                                        readonly
                                        :placeholder="item.field.display"
                                        v-model="dataModel[item.field.name]">
                                    </textarea>
                            </fg-input>

                            <!-- 富文本 -->
                            <fg-input v-else-if="item.field.type === 'richText'" :label="item.field.display"
                                      :placeholder="item.field.display" :name="item.field.name"
                                      v-model="dataModel[item.field.name]">
                                <rich-text v-model="dataModel[item.field.name]" :isView="true"></rich-text>
                            </fg-input>

                            <!-- 文本框 -->
                            <fg-input v-else readonly :label="item.field.display" :placeholder="item.field.display" :name="item.field.name"
                                      v-model="dataModel[item.field.name]"></fg-input>
                        </div>
                    </div>
                </card>

                <card v-if="attachMultiFields.length > 0">
                    <attach-list
                        v-for="f in attachMultiFields"
                        :key="f.id"
                        :resourceId="id"
                        :title="f.display"
                        v-model="dataModel[f.name]">
                    </attach-list>
                </card>
            </div>
        </template>
    </div>
</template>

<script>
    import {Tabs, TabPane} from 'element-ui'
    import ColorPickerJq from '../Inputs/ColorPickerJq'
    import {Select, Option, DatePicker} from 'element-ui'
    import formGroupSelect from '../Inputs/formGroupSelect'
    import CheckBoxList from '../Inputs/CheckboxList'
    import Attach from '../Inputs/Attach'
    import AttachList from './AttachList'
    import RadioList from '../Inputs/RadioList'
    import Switch from '../Switch'
    import ChildModuleView from './ChildModuleView'
    import RichText from '../Inputs/RichText'
    import FlowRouterButton from '../flow/FlowRouterButton'

    export default {
        name: 'module-edit',
        components: {
            [Tabs.name]: Tabs,
            [ColorPickerJq.name]: ColorPickerJq,
            [TabPane.name]: TabPane,
            [Option.name]: Option,
            [Select.name]: Select,
            [formGroupSelect.name]: formGroupSelect,
            [CheckBoxList.name]: CheckBoxList,
            [Attach.name]: Attach,
            [AttachList.name]: AttachList,
            [RadioList.name]: RadioList,
            [Switch.name]: Switch,
            [ChildModuleView.name]: ChildModuleView,
            [RichText.name]: RichText,
            FlowRouterButton
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
                childrenTab: [],
                column: 2,
                dataModel: {},
                tagCode: '',
                id: ''
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
            },
            showFields() {
                let fields = this.module.fields.filter(f => {
                    return f.type !== 'hidden' && f.isShowInPage === 1 && f.type !== 'attachMulti'
                })

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
                let fields = this.module.fields.filter(f => f.type !== 'hidden' && f.isShowInPage === 1 && f.type === 'attachMulti')
                return fields
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
            },
            setChildrenTab(children) {
                this.childrenTab = []
                if (!children || children.length === 0) {
                    return
                }
                children.filter(child => child.showTab === 1).forEach(child => this.childrenTab.push(child))
            },
            /**
             * @return {boolean} 如果有 tab 返回 true，否则返回 false
             */
            hasTab() {
                return this.childrenTab.length > 0
            },
            setDefaultValue() {
                if (this.module && this.module.fields) {
                    this.module.fields.filter(f => f.defaultValue).forEach(f => this.setData(f.name, f.defaultValue))
                }
            },
            editJSON(recordId) {
                this.id = this.recordId || this.$route.params.id || this.$route.query.id
                if (this.id === 'add' || this.id === 'placeholder') {
                    this.id = ''
                    return
                }
                if (this.id && this.id.toLowerCase() === 'nullstr') {
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
                    this.$set(this.dataModel, 'deleteAttach', '{}')
                    if (!this.id) {
                        this.id = this.dataModel['id']
                    }
                }, true)
            },
            setData(key, value) {
                this.$set(this.dataModel, key, value)
            },
            handerCheckboxAndRadioListChange(f, result) {
                this.setData(f.valueFieldText, result.text)
                this.setData(f.valueFieldId, result.id)
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
            _handerClosed() {
                this.$parent.close(true)
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
            }
        },
        updated() {
            $('.el-upload--picture-card').hide()
            $('.attach-btn').hide()
            $('.el-upload-list__item-delete').hide()
            $('.el-upload-list__item-status-label').hide()
            $('.el-icon-close').hide()
            $('.el-icon-close-tip').hide()
            $('.colorSelect-span').hide()
            $('.colorSelect-img').hide()
            $('.colorSelect-input').attr('readonly', 'readonly')
        },
        watch: {
            module: {
                deep: true,
                immediate: true,
                handler: function () {
                    this.randerBtn()
                    this.setDefaultValue()
                    this.setChildrenTab(this.module.childTab)
                    this.editJSON(this.recordId)
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
