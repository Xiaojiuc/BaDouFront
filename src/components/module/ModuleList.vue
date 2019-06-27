<template>
    <div class="module-list">
        <search-bar
            v-show="showSelector"
            :use-filter="useFilter"
            :mdCode="module.code"
            :selectorConfig="selectorConfig"
            @search="search">
        </search-bar>

        <card v-if="showBtn">
            <button v-for='btn in buttons' v-if="!btn.isHide" @click='exeMethod(btn.id)' class='btn' :class="$store.getters['SysStyle/btnClass']"><i
                :class="btn.icon"></i>{{ btn.name }}
            </button>
        </card>

        <!-- v-if="module.id" 存在module时才去加载数据 -->
        <pagelist
            v-if="module.code"
            ref='list'
            :title="listTitle"
            :url='getUrl()'
            :columns='columns'
            :queryParams="queryParams"
            :sortname="sortname"
            :sortorder="sortorder">
        </pagelist>
    </div>
</template>

<script>
    import SearchBar from 'src/components/search/SearchBar'
    import Pagelist from 'src/components/List/Pagelist.vue'
    import CustomBusi from './CustomBusi'

    export default {
        name: 'module-list',
        components: {
            Pagelist,
            SearchBar
        },
        props: {
            module: {
                type: Object,
                default() {
                    return {
                        id: '',
                        code: '',
                        name: '',
                        moduleDisplay: [],
                        listJs: '',
                        listJsObj: {},
                        selectorData: [],
                        searchCondition: [],
                    }
                }
            },
            useFilter: {
                type: Boolean,
                default: true
            },
            useSelector: {
                type: Boolean,
                default: true
            },
            sortname: {
                type: String,
                default: ''
            },
            sortorder: {
                type: String,
                default: 'desc'
            },
            defaultButtons: {
                type: Array
            },
            url: {
                type: String,
            },
            listTitle: String,
            colsFormatter: {
                type: Object
            }
        },
        data() {
            return {
                queryParams: {},
                searchParam: '',
                buttons: [],
                CustomBusi: CustomBusi
            }
        },
        computed: {
            columns() {
                let arr = []
                this.module.moduleDisplay.filter(f => !f.isHidden).forEach(f => {
                    let cf = this.getColumnFormatter(f);
                    if (cf === false) return
                    arr.push({
                        prop: f.name,
                        label: f.display,
                        minWidth: f.listWidth,
                        formatter: cf.formatter,
                        c_hander: cf.hander
                    })
                })
                return arr
            },
            btnMethod() {
                let obj = {}
                this.buttons.forEach(btn => obj[btn.id] = btn.click)
                return obj
            },
            selectorConfig() {
                return {selectorData: this.module.selectorData, searchCondition: this.module.searchCondition}
            },
            showSelector() {
                return this.useSelector && this.module.selectorData && this.module.selectorData.length > 0
            },
            showBtn() {
                let arr = this.buttons.filter(b => !b.isHide)
                return arr.length > 0
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
            search(searchParam) {
                this.updateQueryParam('searchParam', JSON.stringify(searchParam))
                // 通过 setTimeout 让出控制流，使 VUE 更新子组件的 searchParam
                setTimeout(this.$refs.list.reset)
            },
            refresh() {
                this.$refs.list.refresh()
            },
            reset() {
                this.$refs.list.reset()
            },
            updateQueryParam(key, value) {
                this.queryParams[key] = value
            },
            removeQueryParam(key) {
                delete this.queryParams[key]
            },
            resetQueryParam() {
                this.queryParams = {}
            },
            getUrl() {
                // 在列表页JS 中定义的 URL
                if (this.module.listJsObj.listDataUrl) {
                    return this.module.listJsObj.listDataUrl.call(this)
                }
                // 父组件传进来的 URL
                if (this.url) {
                    return this.url
                }
                // 默认的 URL
                return `${this.INTERFACE.moduleListData}?mdCode=${this.module.code}`
            },
            /**
             * 获取钻取列的格式化方法
             * @param {string} drillUrl 钻取的url
             * @param {number} drillUrlOpenType 钻取页面的打开方式 1新tab，2新窗口，目前（2019-3-6）还没有tab，为1是在当前窗口打开
             * @param {string} drillPageTitle 钻取页面的title，目前（2019-3-6）还没有什么用
             */
            getDrillFormatter (drillUrl, drillUrlOpenType, drillPageTitle) {
                // 格式化参数
                let formatter = (row, column, cellValue, index, vue) => {
                    if (cellValue) {
                        return `<a class="drill">${cellValue}</a>`
                    }
                    return ''
                }

                // 点击后回调的函数
                let hander = (row, value, index, vue) => {
                    if (!value) {
                        return
                    }

                    // 替换drillUrl 中的变量
                    let reg = /VAR-(.*?)-VAR/g
                    while (reg.exec(drillUrl)) {
                        let key = RegExp.$1 ? RegExp.$1 : RegExp.$2
                        drillUrl =  drillUrl.replace('VAR-' + key + '-VAR', row[key])
                    }

                    // 以 http 开头的不是路由，使用原生的跳转方式
                    if (drillUrl.startsWith('http')) {
                        if (drillUrlOpenType === 2) {
                            window.open(drillUrl)
                        }
                        window.location.href = drillUrl
                        return
                    }

                    // 跳转路由
                    vue.$router.push({path: drillUrl})
                }

                return {formatter, hander}
            },
            getImgSingleFormatter() {
                // 格式化参数
                let formatter = (row, column, cellValue, index, vue) => {
                    if (cellValue) {
                        let url = vue.INTERFACE.downloadAttach + '?attachId=' + cellValue
                        return `<img class="list-img" src="${url}" />`
                        // return `<a class="drill">${cellValue}</a>`
                    }
                    return ''
                }

                return {formatter}
            },
            /**
             *  格式化单附件
             *
             */
            getAttachFormatter(field) {
                // 格式化参数
                let formatter = (row, column, cellValue, index, vue) => {
                    if (field.valueFieldText) {
                        return `<a class="drill">${row[field.valueFieldText]}</a>`
                    } 
                    if ((row[field.valueFieldId] && !field.valueFieldText) || cellValue) {
                        return `<a class="drill">下载附件</a>`
                    }
                    return ''
                }
                // 点击后回调的函数
                let hander = (row, value, index, vue) => {
                    if (field.valueFieldId && row[field.valueFieldId]) {
                        window.open(vue.INTERFACE.downloadAttach + '?attachId=' + row[field.valueFieldId])
                        return
                    }
                    if (value) {
                        window.open(vue.INTERFACE.downloadAttach + '?attachId=' + value)
                        return
                    }
                    return
                }

                return {formatter, hander}
            },
            /* 金额格式化 */
            getMoneyFormatter() {
                // 格式化参数
                let formatter = (row, column, cellValue, index, vue) => {
                    if (cellValue) {
                        return vue.toMoney(cellValue)
                    }
                    return ''
                }
                return {formatter}
            },
            /**
             * 返回false时表示不渲染
             * 返回的数据需要符合 {formatter: function(row, column, value, index, vue), hander: function(row, value, index, vue)} 这样的格式。
             * 其中 formatter 为格式化数据的方法，hander 为点击时触发的方法
             */
            getColumnFormatter(field) {
                if (this.module.listJsObj && this.module.listJsObj.renderColumn 
                    && this.module.listJsObj.renderColumn[field.name] !== undefined) {
                    return this.module.listJsObj.renderColumn[field.name]
                }
                if (this.colsFormatter && this.colsFormatter[field.name] !== undefined) {
                    return this.colsFormatter[field.name]
                }
                if (field.type === 'imgSingle') {
                    return this.getImgSingleFormatter()
                } else if (field.drillUrl) {
                    return this.getDrillFormatter(field.drillUrl, field.drillUrlOpenType, field.drillPageTitle);
                } else if (field.type === 'attach') {
                    return this.getAttachFormatter(field)
                }
                return {}
            }
        },
        watch: {
            module: {
                deep: true,
                immediate: true,
                handler: function () {
                    let customBtns
                    if (this.module.listJsObj) {
                        customBtns = this.module.listJsObj.buttons
                    }
                    this.randerBtn(customBtns)
                    if (this.$refs.list)
                        Promise.resolve().then(this.$refs.list.reset)
                }
            }
        }
    }
</script>

<style lang="css" scoped>
    .card {
        margin-bottom: 10px;
    }

    .card-body button {
        margin-right: 10px;
    }

    .module-list >>> .drill {
        color: #2c6cf6;
        cursor: pointer;
    }
    .module-list >>> .list-img {
        width: 50px
    }
</style>
