<!--
搜索组件，点击搜索按钮，或者搜索项有改变时，抛出 search 事件，参数为搜索条件
-->
<template>
    <div class="searchBar">

        <!-- 过滤器 -->
        <s-filter
            v-if="useFilter"
            :mdCode="mdCode"
            @click="filterChick"
            @cancel="resetAndSearch"
            @save="filterSave">
        </s-filter>

        <!-- 搜索框 -->
        <div class="search-box">
            <template v-for="item in selectorCfg">
                <!-- 下拉多选 -->
                <s-multiple-select
                    ref="selectors"
                    v-if="item.selectType === 0"
                    :selector="item"
                    @change="search">
                </s-multiple-select>

                <!-- 文本框 -->
                <s-text
                    ref="selectors"
                    v-if="item.selectType === 1"
                    :selector="item"
                    @change="search">
                </s-text>

                <!-- 日期选择 -->
                <s-date
                    ref="selectors"
                    v-if="item.selectType === 5"
                    :selector="item"
                    @change="search">
                </s-date>

                <!-- 单选 -->
                <s-single-select
                    ref="selectors"
                    v-if="item.selectType === 9"
                    :selector="item"
                    @change="search">
                </s-single-select>
            </template>

            <!-- 更多条件选择框 -->
            <div class="search-value" v-if="hasExtra">
                <el-popover
                    placement="bottom"
                    width="150"
                    trigger="click">
                    <el-checkbox v-for="(item,index) in extraSelectorCfg" :key="index"
                                 v-model="extraCheckedList[index]">
                        {{item.name}}
                    </el-checkbox>
                    <el-button slot="reference" plain>更多</el-button>
                </el-popover>
            </div>
            <el-button @click="search" style="color: #007FBE;position: relative; top: 2px;">
                <span style="position: relative;bottom: 2px;"><i class="fa fa-search"></i>搜索</span>
            </el-button>
            <el-button @click="resetAndSearch" style="color: #007FBE;position: relative; top: 2px;">
                <span style="position: relative;bottom: 2px;"><i class="fa fa-exchange"></i>重置</span>
            </el-button>
        </div>

        <!-- 更多搜索框 -->
        <div class="search-box">
            <template v-for="(item, index) in extraSelectorCfg">
                <!-- 下拉多选 -->
                <s-multiple-select
                    ref="extraSelectors"
                    v-if="item.selectType === 0"
                    v-show="extraCheckedList[index]"
                    :selector="item"
                    @change="search">
                </s-multiple-select>

                <!-- 文本框 -->
                <s-text
                    ref="extraSelectors"
                    v-if="item.selectType === 1"
                    v-show="extraCheckedList[index]"
                    :selector="item"
                    @change="search">
                </s-text>

                <!-- 日期选择 -->
                <s-date
                    ref="extraSelectors"
                    v-if="item.selectType === 5"
                    v-show="extraCheckedList[index]"
                    :selector="item"
                    @change="search">
                </s-date>

                <!-- 单选 -->
                <s-single-select
                    ref="extraSelectors"
                    v-if="item.selectType === 9"
                    v-show="extraCheckedList[index]"
                    :selector="item"
                    @change="search">
                </s-single-select>
            </template>
        </div>
    </div>
</template>
<script>

    import {Dialog, Dropdown, DropdownMenu, DropdownItem, Popover, Checkbox, DatePicker, Radio} from 'element-ui'

    import SFilter from './filter/filter'
    import SDate from './component/Date'
    import SText from './component/Text'
    import SMultipleSelect from './component/MultipleSelect'
    import SSingleSelect from './component/SingleSelect'

    export default {
        name: 'search-bar',
        components: {
            [Dialog.name]: Dialog,
            [Dropdown.name]: Dropdown,
            [DropdownMenu.name]: DropdownMenu,
            [DropdownItem.name]: DropdownItem,
            [Popover.name]: Popover,
            [Checkbox.name]: Checkbox,
            [DatePicker.name]: DatePicker,
            [Radio.name]: Radio,
            [SDate.name]: SDate,
            [SText.name]: SText,
            [SMultipleSelect.name]: SMultipleSelect,
            [SSingleSelect.name]: SSingleSelect,
            [SFilter.name]: SFilter,
        },
        props: {
            // 模型编码，用于过滤器
            mdCode: '',
            // 是否使用过滤器
            useFilter: {
                default: true
            },
            // 搜索框配置
            selectorConfig: {
                type: Object,
                default() {
                    return {
                        selectorData: [],
                        searchCondition: [],
                    }
                }
            },
        },
        computed: {
            hasExtra() {
                return this.extraSelectorCfg.length > 0
            }
        },
        data() {
            return {
                // 搜索框的配置
                selectorCfg: [],
                // 更多搜索框的配置
                extraSelectorCfg: [],
                // 更多搜索框下拉选择列表对应的 是否选中数组
                extraCheckedList: [],
            }
        },
        methods: {
            // 获取搜索器的值
            getSelectorValue() {
                let searchParam = []

                let selectors = this.$refs.selectors
                selectors.forEach(s => {
                    let val = s.getSelectorValue()
                    if (val) {
                        searchParam.push(val)
                    }
                })

                // 更多的搜索器的搜索条件
                let extraSelectors = this.$refs.extraSelectors
                if (extraSelectors) {
                    extraSelectors.filter((s, i) => this.extraCheckedList[i]).forEach(s => {
                        let val = s.getSelectorValue()
                        if (val) {
                            searchParam.push(val)
                        }
                    })
                }

                return searchParam
            },
            /**
             * 获取搜索框的值，并抛出 search 事件
             */
            search() {
                this.$emit('search', this.getSelectorValue())
            },
            /**
             * 重置搜索框
             */
            resetSearchParam() {
                let selectors = this.$refs.selectors
                if (selectors) {
                    selectors.forEach(s => s.reset())
                }

                let extraSelectors = this.$refs.extraSelectors
                if (extraSelectors) {
                    extraSelectors.forEach(s => s.reset())
                }
            },
            // 重置搜索框并抛出 search 事件
            resetAndSearch() {
                this.resetSearchParam()
                this.search()
            },
            filterChick(filterInfo) {
                this.resetSearchParam()

                let searchValArr = JSON.parse(filterInfo.content)
                searchValArr.forEach(v => {
                    let selector = this.getSelector(v.name)
                    if (selector) {
                        selector.setValue(v.value)
                        return
                    }

                    // 如果上面没有找到，就在扩展搜索器中查找
                    let extra = this.getExtraSelector(v.name)
                    if (extra) {
                        extra.selector.setValue(v.value)
                        this.$set(this.extraCheckedList, extra.index, true)
                    }
                })
                this.search()
            },
            filterSave(filterInfo) {
                console.log(filterInfo)
            },
            /**
             * 根据搜索器ID获取搜索器
             */
            getSelector(selectorId) {
                if (this.$refs.selectors) {
                    let arr = this.$refs.selectors
                    for (let i in arr)
                        if (arr[i].getSelectorInfo().id == selectorId)
                            return arr[i]
                }
                return null
            }
            ,
            /**
             * 根据搜索器ID获取扩展搜索器
             */
            getExtraSelector(selectorId) {
                if (this.$refs.extraSelectors) {
                    let arr = this.$refs.extraSelectors
                    for (let i in arr)
                        if (arr[i].getSelectorInfo().id == selectorId)
                            return {selector: arr[i], index: i}
                }
                return null
            }
            ,
        },
        watch: {
            selectorConfig: {
                deep: true,
                handler: function () {
                    // 每当搜索配置修改时，重置搜索条件
                    this.resetSearchParam()

                    let cfg = this.selectorConfig.selectorData
                    let condition = this.selectorConfig.searchCondition
                    this.selectorCfg = []
                    this.extraSelectorCfg = []
                    // 把多选，单选等搜索项放到搜索配置中，这里目前(2019-2-14)只处理了搜索项数据来源为数据字典的情况
                    for (let i in cfg) {
                        for (let j in condition) {
                            if (cfg[i].id === condition[j].id) {
                                cfg[i].searchCondition = condition[j].data
                                break
                            }
                        }

                        // 扩展的搜索器与非扩展的搜索器分开存放
                        if (cfg[i].isExtended) {
                            this.extraSelectorCfg.push(cfg[i])
                        } else {
                            this.selectorCfg.push(cfg[i])
                        }
                    }
                }
            }
        }
        ,
    }
</script>
<style scoped>
    .searchBar {
        width: 100%;
        height: auto;
        background-color: white;
        margin-bottom: 10px;
        padding: 1% 0 1% 0;
        border: 1px solid rgba(0, 0, 0, 0.125);
    }

    .searchBar >>> .filter {
        padding-left: 1%;
        background-color: #fdfdfd
    }

    .searchBar >>> .filter p {
        background-color: #fdfdfd;
        padding: 0 0 10px 0;
        display: inline-block;
        margin-right: 5px;
    }

    .searchBar >>> .filterName {
        color: #5d5d5d;
    }

    .searchBar >>> .alert-btn {
        color: #007FBE;
        margin: 0 5px;
        cursor: pointer;
    }

    .searchBar >>> .alert-btn:hover {
        color: #f36100;
    }

    .searchBar >>>  p span:hover {
        color: #f36100;
    }

    .searchBar >>> .fiterName i {
        color: #bbb;
    }

    .searchBar >>> .fiterName i:hover {
        color: #333;
    }

    .searchBar >>> .search-box {
        display: block;
        width: 100%;
        height: auto;
        margin-top: 3px;
        font-size: 14px;
    }

    .searchBar >>> .search-value {
        width: auto;
        height: auto;
        margin-left: 1%;
        display: inline-block;
        margin-bottom: 10px;
    }

    .searchBar >>> .el-picker-panel__content .el-month-table td .cell {
        font-size: 12px;
    }

    .searchBar >>> .search-value input {
        width: 200px;
        height: 35px;
        border: 1px solid #DCE0E9;
        border-radius: 5px;
        padding-left: 5px;
        /* padding-top: 5px; */
    }

    .searchBar >>> .search-box button {
        height: 35px;
        margin-left: 1%;
        outline: none;
    }

    .searchBar >>> .dialog-title {
        border-bottom: 1px solid #D8D8D8;
        margin: 0 20px;
        padding: 10px 0;
    }

    .searchBar >>> .dialog-span {
        float: right;
        margin-left: 10px;
        color: #9191e8;
    }

    .searchBar >>> .dialog-content {
        display: block;
        padding: 0 10px;
        margin: 0 20px;
        cursor: pointer;
    }

    .searchBar >>> .dialog-item {
        display: inline-block;
        background-color: #c2e2f2;
        color: #e2f0f7;
        margin: 5px 5px;
        text-align: center;
        width: 100px;
        height: 35px;
        border-radius: 50px;
        overflow: hidden;
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 7px 10px 0px 10px;
    }

    .searchBar >>> .dialog-item i {
        color: white;
    }

    .searchBar >>> .dialog-item i:hover {
        color: unset;
    }

    .searchBar >>> .selected {
        background-color: #52b3df;
        color: white;
    }

    .searchBar >>> .el-dialog__body {
        padding: 0;
    }

    .searchBar >>> .dialog-user {
        display: inline-block;
        width: 70px;
        height: 80px;
        margin: 3px 10px;
        padding-top: 5px;
        text-align: center;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
    }

    .searchBar >>> .dialog-user i {
        display: block;
        font-size: 30px;
        margin: 0 auto;
        color: #333;
    }

    .searchBar >>> .dialog-user img {
        position: absolute;
        font-size: 18px;
        color: #49b1e0;
        left: 0;
    }

    .searchBar >>> .el-dialog__footer {
        border-top: 1px solid #e7e4f0
    }

    .searchBar >>> .dialog-text {
        padding: 20px 20px 10px 20px;
    }

    .searchBar >>> .search-value el-dropdown {
        height: 35px;
        padding-top: 6px;
        font-size: 16px;
        outline: none;
    }

    .searchBar >>> .el-checkbox {
        display: block;
    }

    .searchBar >>> .text-style {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .searchBar >>> .search-value span {
        display: inline-block;
    }

    .searchBar >>> .selector_name {
        display: inline-block;
        margin-right: -15px;
        margin-left: 10px;
    }
</style>
