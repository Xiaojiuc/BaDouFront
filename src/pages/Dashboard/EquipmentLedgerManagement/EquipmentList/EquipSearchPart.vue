<template>
	<div>
		<div>
            <span>全部</span>
            <svg class="icon small" aria-hidden="true">
                <use xlink:href="#icon-jiantouyou"></use>
            </svg>
            <div class="chooseItem" v-for="h in hasChooseList" :key='h.id'>
                <span>{{h.type}}:</span>
                <span>{{h.value}}</span>
                <span class="deleteBtn" @click="deleteType(h)">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-guanbi"></use>
                    </svg>
                </span>
            </div>
            <el-input
                class="searchArea"
                placeholder="请输入名称"
                v-model="searchParams.name">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="search()"></i>
            </el-input>
        </div>
        <div>
            <div class="typeShow">
                <table>
                    <tr class="item" v-for="t in show_typeList" :key='t.id'>
                        <td class="name">{{t.name}}</td>
                        <td class="value">
                            <div class="_main">
                                <div>
                                    <div class="_item pointer" v-for='l in t.data' :key='l.key' @click='addChoose(t.name, l)'>{{l.value}}</div>
                                </div>
                            </div>
                        </td>
                        <!-- <td class="op color-main">
                            <div class="pointer">
                                更多
                                <i class="el-icon-arrow-right el-icon-right"></i>
                            </div>
                        </td> -->
                    </tr>
                </table>
                <!-- <div class="pointer color-main floatR moreChooseType" v-if="isMoreTypeList" @click="showMoreTypeList()">
                    更多选项
                    <i class="el-icon-arrow-right el-icon-right"></i>
                </div> -->
            </div>
        </div>
        <div class="equimentList">
            <div class="title bg-main">
                <div class="sort">
                    投运时间
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jiantou"></use>
                    </svg>
                </div>
                <div class="pageInfo floatR" v-if = 'eqList.pageSizeAll !== 0'>
                    <div class="nextPage">
                        <span  v-if="searchParams.pageIndex > 1"  @click='nextPage(-1)'>
                            上一页
                        </span>    
                    </div>
                    <span class="page" v-if="eqList.pageIndexAll > 0">{{searchParams.pageIndex}} / {{eqList.pageIndexAll}}</span>
                    <div class="nextPage">
                        <span class="nextPage" v-if="(eqList.pageIndexAll > 1) && (eqList.pageIndexAll !== searchParams.pageIndex)" @click='nextPage(1)'>
                            下一页
                        </span>
                    </div>
                </div>
            </div>
            <div class='_main'>
                <el-row v-show="eqList.list.length !== 0">
                    <el-col :span="5" v-for="e in eqList.list" :key='e.assetid' @click.native="goDetail(e.locationid)">
                        <div class="font12 m-body">
                            <div class='g-body'>
                                <div class="imgArea">
                                    <img :src="e.img" :onerror='DEFAULT'>
                                </div>
                                <div style="min-height:100px">
                                    <div class="section1">
                                        <span class="color-tip">{{e.assetcode}}</span>
                                    </div>
                                    <div class="section2">
                                        <span class="">{{e.siteid | formatSite}}</span>
                                        <span><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jiantouyou"></use></svg></span>
                                        <span class="">{{e.classname}}</span>
                                        <span><svg class="icon" aria-hidden="true"><use xlink:href="#icon-jiantouyou"></use></svg></span>
                                        <span class="">{{e.name}}</span>
                                    </div>
                                    <div class="textR"><div class="statusWord">{{e.status}}</div></div>
                                    <div class="color-tip">{{e.deliverydate}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div v-show="eqList.list.length == 0" class="noDataTip">{{workTip}}</div>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'EquipSearchPart',
        components: {
        },
		data () {
			return {
				hasChooseList: [],
				searchData: '',
                typeList: [
                    { id: 1, name: '功能位置分类', data:[]},
                    { id: 2, name: '电压等级', data: []},
                    { id: 3, name: '设备状态', data: []},
                    { id: 4, name: '投运时间', data: []}
                ],
                /*展示前面4条数据*/
                show_typeList: [],
                /*展示更多种类选择的数据的状态*/
                isMoreTypeList: false,
                searchParams: {
                    name: '',         /*模糊匹配搜索参数*/
                    classname: '',    /*功能位置分类: '设备'*/
                    voltage: '',      /*电压等级: '220kV'*/
                    status: '',       /*设备状态: '投运'*/
                    yeas: '',         /*投运时间: '2018'*/
                    pageIndex: 1,     /*页码: 1*/
                    pageSize: 10      /*每页显示记录数量: 3*/
                },
                eqList: {
                    pageIndexAll: 1,
                    pageSizeAll: 0,
                    list: []
                },
                workTip: '暂无相关数据',
			}
		},
		methods: {
            goDetail:function (id) {
                this.$emit('updateDetail', id)
            },
			nextPage: function (op) {
				if (op === 1) {
					this.searchParams.pageIndex ++
				} else {
					this.searchParams.pageIndex --
				}
				this.getList()
			},
			search: function () {
				if ( (this.searchParams.name === '') || (this.searchParams.name === undefined) || (this.searchParams.name === null)) {
					this.alert('请输入搜索关键词')
					return false
				}
				this.getList()
			},
			getList: function () {
				/*列表每次只会显示一页数据,所以每次请求时先清空*/
				this.eqList.list = []
				this.workTip = '数据加载中...'
				this.dealChoose()
				this.post(this.INTERFACE.queryLevelTAssets, this.searchParams, (isSuccess, res) => {
					if (isSuccess) {
						/*分页==>pageNo: 页序, pageCount:总页数, pageSize:单页数据量, total:总数*/
						if (res.rows.length === 0) {
							this.workTip = '暂无相关数据'
							this.eqList.pageIndexAll = 0
							this.eqList.pageSizeAll = 0
						} else {
							this.eqList.pageIndexAll = res.pageCount
							this.eqList.pageSizeAll = res.total
							res.rows.forEach( (i) => {
								i.img = '../../../../static/img/default.png'
							})
						}
						this.eqList.list = res.rows
						this.loadingClose()
					}
				}, true)
			},
			dealChoose: function () {
				/*重新设置参数前需要清空原有设置*/
				this.searchParams.classname = ''
				this.searchParams.voltage = ''
				this.searchParams.status = ''
				this.searchParams.yeas = ''
				if (this.hasChooseList.length === 0) {
					this.searchParams.classname = ''
					return false
				}
				this.hasChooseList.forEach( (i) => {
					if (i.type === '功能位置分类') {
						this.searchParams.classname = i.value
					}
					if (i.type === '电压等级') {
						this.searchParams.voltage = i.value
					}
					if (i.type === '设备状态') {
						this.searchParams.status = i.value
					}
					if (i.type === '投运时间') {
						this.searchParams.yeas = i.value
					}
				})
			},
			addChoose: function (name, obj) {
				if (this.hasChooseList.length !== 0) {
					try {
						this.hasChooseList.forEach( (i, index) => {
							if (i.type === name) {
								i.value = obj.key
								throw 'end up'
							}
							if ((i.type !== name) && (this.hasChooseList.length - 1 === index)) {
								this.hasChooseList.push({
									type: name,
									value: obj.key,
								})
							}
						})
					} catch (e) {
						console.log(e)
					}

				} else {
					this.hasChooseList.push({
						type: name,
						value: obj.key,
					})
				}
				/*请求数据*/
				this.getList()
			},
			deleteType(obj) {
				this.remove(this.hasChooseList, obj)
				/*请求数据*/
				this.getList()
			},
			dealDoubleDictonary: function (arrayList) {
	            var temp = [] //一个新的临时数组
	            for(var i = 0; i < arrayList.length; i++){
	            	if (i == 0) {
	            		temp.push(arrayList[i])
	            	} else {
	            		if (arrayList[i].orderNum !== arrayList[i - 1].orderNum) {
	            			temp.push(arrayList[i])
	            		}
	            	}
	            }
	            return temp
        	},
		},
		created: function () {
			if (this.typeList.length > 4) {
				this.isMoreTypeList = true
				this.show_typeList = this.typeList.slice(0, 4)
			} else {
				this.show_typeList = this.typeList
			}
			/*获取功能位置分类数据*/
			this.post(this.INTERFACE.getAllLocationClass, {}, (isSuccess, res) => {
				if (isSuccess) {
					res.forEach( (i) => {
						i.key = i.name
						i.value = i.name
					})
					this.typeList[0].data = res
				}
			}, true)
			/*获取电压等级分类数据*/
			this.get(this.INTERFACE.VOLTAGEGRADES, {}, (isSuccess, res) => {
				if (isSuccess) {
					this.typeList[1].data = this.dealDoubleDictonary(res)
				}    
			}, true)
			/*获取设备状态种类数据*/
			this.get(this.INTERFACE.ASSETSTATUS, {}, (isSuccess, res) => {
				if (isSuccess) {
					this.typeList[2].data = this.dealDoubleDictonary(res)
				}
			}, true)
			/*获取投运时间种类数据*/
			this.get(this.INTERFACE.OPERATEYEARS, {}, (isSuccess, res) => {
				if (isSuccess) {
					this.typeList[3].data = this.dealDoubleDictonary(res)
					console.log(JSON.stringify(this.typeList))
				}    
			}, true)
			/*获取列表数据*/
			this.getList()
		}
	}
</script>
<style scoped>
	/* 界面宽度需求限制 end*/
    /* 筛选选中样式块 start */
    .chooseItem{
        border: 1px dotted #EE363A;
        color: #EE363A;
        display: inline-block;
        padding: 2px 4px;
        margin-right: 15px;
    }
    .chooseItem *{
        font-size: 12px;
    }
    .chooseItem .deleteBtn{
        font-weight: 700;
        padding-left:6px;
        padding-right: 4px;
    }
    .chooseItem .deleteBtn .icon{
        fill: #E94F4F;
        width: 1em;
    }
    /* 筛选选中样式块 end */
    .icon.small{
        fill: #333;
    }
    .typeShow{
        margin: 10px 0px 30px;
    }
    .typeShow:after{
        content:".";        
        display:block;        
        height:0;        
        clear:both;        
        visibility:hidden;        
    }
    .typeShow table{
        border: 1px solid rgba(9,175,229,0.3);
        width: 100%;
    }
    .typeShow *{
        font-size: 12px;
    }
    .typeShow td{
        border-bottom: 1px solid rgba(9,175,229,0.3)
    }
    .typeShow .item .name{
        background: #c6e7f2;
        color: #09AFE5;
        padding: 0px 12px;
        min-width: 130px;
    }
    .typeShow .item .value{
        width: calc(100% - 200px);
    }
    .typeShow .item .value ._item{
        display: inline-block;
        padding: 6px 20px
    }
    .typeShow .item .op{
        width: 50px
    }
    .moreChooseType{
        background: #c6e7f2;
        padding: 7px 10px;
        display: inline-block;
    }
    /* 倒三角形 end */
    .equimentList .el-row .el-col{
        cursor: pointer;
        width: 20% !important;
    }
    .equimentList .el-row .el-col .m-body:hover{
        box-shadow: 0px 1px 9px 0px rgba(6, 172, 226, 0.7);
        -webkit-box-shadow: 0px 1px 9px 0px rgba(6, 172, 226, 0.7);
    }
    /* 搜索页面 start */
    .equimentList .icon{
        fill: #fff;
        width: 1em;
    }
    .equimentList .title{
        color: #fff;
        padding: 6px 10px;
        margin-bottom: 6px;
    }
    .equimentList .sort{
        display: inline-block;
    }
    .equimentList .pageInfo{
        margin-right: 10%;
    }
    .equimentList .pageInfo .page{
        font-weight: 600;
    }
    .nextPage{
        width: 60px;
        text-align: center;
        display: inline-block;
        color: #fff;
        cursor: pointer;
    }
    .nextPage:hover{
        text-shadow: 0px -1px 0 #fff, 1px 1px 0 #9e9e9e;
    }
    .equimentList ._main .el-col{
        padding: 10px;
    }
    .equimentList ._main .el-col .m-body{
        background: rgba(255,255,255,1);
        box-shadow: 0px 1px 9px 0px rgba(6,172,226,0.22);
        border-radius: 8px;
        padding: 10px
    }
    .equimentList ._main .el-col .m-body .g-body .imgArea{
        width: calc(100% - 30px);
        margin: auto;
        margin-bottom: 10px;
        min-height: 80px;
    }
    .equimentList ._main .el-col .m-body .g-body .imgArea img{
        width: 100%;
        height: 100%;
    }
    .equimentList ._main .el-col .m-body .g-body .section1,
    .equimentList ._main .el-col .m-body .g-body .section2{
        margin-bottom: 6px
    }
    .equimentList ._main .el-col .m-body .g-body .section2 .status{
        display: inline-block;
        background: rgba(105,217,113,1);
        border-radius: 2px;
        padding: 2px 4px;
        color: #fff;
    }
    .equimentList .g-body .section1 span{
        vertical-align: sub;
    }
    .equimentList .g-body .section1 div{
        display: inline-block;
        background: rgba(105,217,113,1);
        border-radius: 2px;
        padding: 2px 4px;
        color: #fff;
    }
    .equimentList .g-body .section2 .icon{
        fill: #09AFE5;
        width: 0.8em;
    }
    .equimentList .g-body .section2 .grade:last-child .icon{
        display: none;
    }
    /* 搜索页面 end */
</style>