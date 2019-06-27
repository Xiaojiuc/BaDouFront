<template>
    <div class='equipmentAccountInquiry'>
        <div class="titleShow">
            <span class="title">设备台账查询</span>
            <span class="function">
                <span v-if='!isShow'  @click='isShow = !isShow'>
                    <span class="color-main">设备列表</span>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-liebiao"></use>
                    </svg>
                </span>
                <span v-if='isShow'  @click='isShow = !isShow'>
                    <span class="color-main">快速搜索</span>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-sousuo"></use>
                    </svg>
                </span>
            </span>
        </div>
        <div v-show='!isShow'>
            <EquipSearchPart v-on:updateDetail='goDetail'></EquipSearchPart>
        </div>
        <div v-show='isShow'>
            <zTree ref='zTree' v-on:setLocationId='updateDetail'></zTree>
            <div class="tab boxshadow cardShow">
                <vue-tabs value="Description">
                    <v-tab :title="t.name" v-for="t in tabList" :key='t.id'>
                        <div v-show='t.id == 1' class="function">
                            <div class="functionShow">
                                <div class="_main">
                                    <div class="imgArea">
                                        <img :src="funImg.list[0].img">
                                    </div>
                                    <div class="imgList">
                                        <div class="iconImg" v-if='funImg.list.length >4'>
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-jiantouzuo"></use>
                                            </svg>
                                        </div>
                                        <div class="iconImg" v-for="i in funImg.list" :key="i.img"><img :src='i.img'></div>
                                        <div class="iconImg" v-if='funImg.list.length >4'>
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-jiantouyou"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dataShow">
                                <div class="catalog">
                                    <p class="locations">
                                        <span class="item" v-for="l in functionInfo.locations" :key='l'>
                                            <span>{{l}}</span>
                                            <span>
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-jiantouyou"></use>
                                                </svg>
                                            </span>
                                        </span>
                                    </p>
                                </div>
                                <div class="spanCol2 ">
                                    <p>
                                        <span>运行编码: </span>
                                        <span>{{functionInfo.RUNNUM?functionInfo.RUNNUM: '无'}}</span>
                                    </p>
                                    <p>
                                        <span>位置类型: </span>
                                        <span>{{functionInfo.LOCATIONTYPE?functionInfo.LOCATIONTYPE: '无'}}</span>
                                    </p>
                                </div>
                                <div class="spanCol2">
                                    <p>
                                        <span>KKS编码: </span>
                                        <span>{{functionInfo.KKSNUM?functionInfo.KKSNUM: '无'}}</span>
                                    </p>
                                    <p>
                                        <span>空间位置: </span>
                                        <span>{{functionInfo.SPLOCATION?functionInfo.SPLOCATION: '无'}}</span>
                                    </p>
                                </div>
                                <div class="spanCol2">
                                    <p>
                                        <span>设备名称: </span>
                                        <span>{{functionInfo.NAME?functionInfo.NAME: '无'}}</span>
                                    </p>
                                    <p>
                                        <span>投运日期: </span>
                                        <span>{{functionInfo.COMMISSIONDATE?functionInfo.COMMISSIONDATE: '无'}}</span>
                                    </p>
                                </div>
                                <div class="spanCol">
                                    <p>
                                        <span>节点属性: </span>
                                        <span>{{functionInfo.LOCATIONCLASS?functionInfo.LOCATIONCLASS: '无'}}</span>
                                    </p>
                                </div>
                                <div class="spanCol">
                                    <p>
                                        <span>调管单位: </span>
                                        <span>{{functionInfo.EQUIPMENTUNIT | formatSite}}</span>
                                    </p>
                                </div>
                                <div class="spanCol">
                                    <p>
                                        <span>检修单位、部门: </span>
                                        <span>{{functionInfo.checkUnit}}</span>
                                    </p>
                                </div>
                                <div class="spanCol">
                                    <p>
                                        <span>运维单位、部门: </span>
                                        <span>{{functionInfo.runUnit}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-show='t.id == 2'>
                            <div class="equimentInfo large">
                                <div class="spanCol2 marB">
                                    <div class="spanCol2">
                                        <p>
                                            <span>设备编码: </span>
                                            <span>{{assetInfo.assetno?assetInfo.assetno: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>设备名称: </span>
                                            <span>{{assetInfo.name?assetInfo.name: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>身份证编码: </span>
                                            <span>{{assetInfo.assetcode?assetInfo.assetcode: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>投入日期: </span>
                                            <span>{{assetInfo.deliverydate?assetInfo.deliverydate: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>KKS编码: </span>
                                            <span>{{assetInfo.kksnum?assetInfo.kksnum: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>出厂日期: </span>
                                            <span>{{assetInfo.manufacturedate?assetInfo.manufacturedate: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>设备分类: </span>
                                            <span>{{assetInfo.assettype?assetInfo.assettype: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>电压等级: </span>
                                            <span>{{assetInfo.voltage?assetInfo.voltage: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>出厂编号: </span>
                                            <span>{{assetInfo.productcode?assetInfo.productcode: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>供应商: </span>
                                            <span>{{assetInfo.supplier?assetInfo.supplier: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>资产级别: </span>
                                            <span>{{assetInfo.assetattr?assetInfo.assetattr: '无'}}</span>
                                        </p>                 
                                        <p>
                                            <span>数量: </span>
                                            <span>{{assetInfo.quantity?assetInfo.quantity: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol">
                                        <p>
                                            <span>进入当前状态时间: </span>
                                            <span>{{assetInfo.statusdate?assetInfo.statusdate: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>设备型号: </span>
                                            <span>{{assetInfo.modelnum?assetInfo.modelnum: '无'}}</span>
                                        </p>
                                        <p>
                                            <span>厂家现名: </span>
                                            <span>{{assetInfo.product?assetInfo.product: '无'}}</span>
                                        </p>
                                    </div>
                                    <div class="spanCol2">
                                        <p>
                                            <span>产权单位: </span>
                                            <span>{{assetInfo.siteid?assetInfo.siteid: '无' | formatSite}}</span>
                                        </p>
                                        <p>
                                            <span>资产状态: </span>
                                            <span>{{assetInfo.status?assetInfo.status: '无'}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div class="titleShow" >
                                        <span class="title">部件清单</span>
                                    </div>                                        
                                    <el-table
                                        :data="partList"
                                        style="width: 100%"
                                        border
                                        stripe
                                        :default-sort = "{prop: 'index', order: 'descending'}">
                                        <el-table-column
                                            type="index"
                                            label="序号"
                                            width="70">
                                        </el-table-column>
                                        <el-table-column
                                            prop="assetno"
                                            label="资产编号"
                                            sortable>
                                        </el-table-column>
                                        <el-table-column
                                            prop="description"
                                            label="描述"
                                            sortable>
                                        </el-table-column>
                                        <el-table-column
                                            prop="num"
                                            label="功能位置编码">
                                        </el-table-column>
                                        <el-table-column
                                            prop="assetattr"
                                            label="资产级别">
                                        </el-table-column>
                                        <el-table-column
                                            label="详情">
                                            <template slot-scope="props">
                                                <a class="btn-info btn-simple btn-link">详情</a>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                        <div v-show='t.id == 3'>
                            <el-table
                                :data="paramsList"
                                style="width: 100%"
                                border
                                stripe
                                :default-sort = "{prop: 'index', order: 'descending'}">
                                 <el-table-column
                                  type="index"
                                  label="序号"
                                  width="70">
                                </el-table-column>
                                <el-table-column
                                    prop="type"
                                    label="产数类型"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="产品名称"
                                    sortable>
                                </el-table-column>
                                <el-table-column
                                    prop="params"
                                    label="参数值">
                                </el-table-column>
                                <el-table-column
                                    prop="remark"
                                    label="备注">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-show='t.id == 4'>  
                            <div class="transferFlow mar">
                                <div class="bg-base flow">
                                    <div class="newsItem" v-for="n in news" :key="news.title">
                                        <div class="newsArea color-grey3" v-if='n.status'>
                                            <div class="newsTitle">
                                                <span class="padR">2017-08-12</span>
                                                <span>设备报缺</span>
                                            </div>
                                            <div class="newsDetail">
                                                <div>
                                                    <span class="padR">2017-08-12</span>
                                                    <span>设备报缺</span>
                                                </div>
                                                <div>
                                                    <span class="padR">报缺人:</span>
                                                    <span>王定发</span>
                                                </div>
                                                <div>
                                                    <span class="padR">缺陷描述:</span>
                                                    <span>由于工作不到位，导致设备启动不正常需要特殊支援</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if='n.status' class="newsPoint_choose">
                                            <div class="point"></div>
                                        </div>
                                        <div v-if='!n.status' class="newsPoint bg-main"></div>
                                        <div class="date">2018-02-11</div>
                                    </div>
                                    <div class="triangle_border_down">
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-show='t.id == 5'>
                            <div class="commentArea">
                                <div class="allType">
                                    <div class="section1">
                                        <span>好评度:</span>
                                        <span class="color-red">
                                            <span class="fontLarge">99</span>%
                                        </span>
                                    </div>
                                    <div class="section2">
                                        <l-radio  :inline='isRadioInline' v-model="enabledRadio" :label="c.id" v-for="c in commentType" :key='c.id'>
                                            <span class="font13" :class="{ 'color-red': enabledRadio===c.id  }">{{c.name}}</span>
                                            <span class="color-tip" v-if="c.id !== '1'">({{c.num}})</span>
                                        </l-radio>
                                    </div>
                                    <!-- <div class="section3">
                                        <div class="word">
                                            推荐排序
                                        </div>
                                        <div class="op">
                                            *
                                        </div>
                                    </div> -->
                                </div>
                                <div class="_main font12">
                                    <div class="userInfo">
                                        <div class="imgArea">
                                            <img src="../../../../static/img/default-avatar.png">
                                        </div>
                                        <span>天生桥设备部</span><br/>
                                        <span>王发发</span>
                                    </div>
                                    <div class="goodsInfo" style="">
                                        <div class="comment padRL">
                                            <p class="word">小机器，虽然小，但是功能量很大，供电也相当稳定，没有什么噪音，比较满意的一款</p>
                                            <div class="imgList">
                                                <div class="item">
                                                    <div class="_main">
                                                        <img src='../../../../static/img/demo/demo1.jpg'>
                                                    </div>
                                                </div>
                                                <div class="item">
                                                    <div class="_main">
                                                        <img src='../../../../static/img/demo/demo2.jpg'>
                                                    </div>
                                                </div>
                                                <div class="item">
                                                    <div class="_main">
                                                        <img src='../../../../static/img/demo/demo3.jpg'>
                                                    </div>
                                                </div>
                                                <div class="item">
                                                    <div class="_main">
                                                        <img src='../../../../static/img/demo/demo1.jpg'>
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="time color-tip">2018-12-06  18:09</span>
                                        </div>
                                        <div class="toComment padRL" style="height: 20px">
                                            <span class="floatR">
                                                <svg class="icon" aria-hidden="true">
                                                    <use xlink:href="#icon-liuyan"></use>
                                                </svg>
                                                <span>12</span>
                                            </span>
                                        </div>
                                        <div class="line"></div>
                                        <div class="reply padRL">
                                            <p class="color-red">
                                                <span class="name">ASPIRE</span>
                                                <span>回复:</span>
                                            </p>
                                            <p class="word color-red textIndent">感谢您对ASPIRE旗舰店的支持!我们坚信把最好的产品呈现到客户手中，是最明智的，一步步走着一步步跑着让您看到我们的努力。 如您使用中有任何疑问可以随时联系在线客服，也很感谢您支持ASPIRE旗舰店</p>
                                            <span class="time color-tip">2018-12-07  18:09</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-tab>
                </vue-tabs>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Radio as LRadio} from 'src/components'
    import {VTab, VueTabs} from 'vue-nav-tabs'
    import 'vue-nav-tabs/themes/vue-tabs.scss'
    import zTree from '../../../components/zTree.vue'
    import EquipSearchPart from './EquipmentList/EquipSearchPart.vue'
    import {Table, TableColumn} from 'element-ui'
    Vue.use(Table) 
    Vue.use(TableColumn) 
    export default {
        name: '',
        components: {
            EquipSearchPart,
            zTree,
            VTab, 
            VueTabs,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            LRadio
        },
        data () {
            return {
                /*资产信息*/
                assetInfo: {},
                /*功能位置信息*/
                functionInfo: {},
                /*功能位置信息-图片列表*/
                funImg: {
                    list: [{
                        img: '../../../../static/img/default.png'
                    }],
                    show: {}
                },
                /*设置详情页面所选设备信息*/
                chooseEqItem: {
                    assetid: '',
                    locationid: ''
                },
                images: ['../../../../static/img/demo/demo1.jpg', '../../../../static/img/demo/demo2.jpg', '../../../../static/img/demo/demo3.jpg'],
                /*显示查询模块*/
                isShow: false,
                isRadioInline: true,
                tabList: [
                    { name: '功能信息', id: 1},
                    { name: '资产信息', id: 2},
                    { name: '设备参数', id: 3},
                    { name: '设备动态', id: 4},
                    { name: '设备评论', id: 5}
                ],
                commentType: [
                    { name: '全部', num: 0, id: '1'},
                    { name: '图片', num: 60, id: '2'},
                    { name: '视频', num: 24, id: '3'},
                    { name: '已回复', num: 217, id: '5'},
                    { name: '未回复', num: 0, id: '6'}
                ],
                enabledRadio: '1',
                news: [
                    { status: 1},
                    { status: 0},
                    { status: 0},
                    { status: 1},
                    { status: 0},
                    { status: 0},
                    { status: 0}
                ],
                partList: [],
                paramsList: [
                    {
                        type: '类型1',
                        name: '名称1',
                        params: '参数1',
                        remark: '备注1'
                    },{
                        type: '类型2',
                        name: '名称2',
                        params: '参数2',
                        remark: '备注2'
                    },{
                        type: '类型3',
                        name: '名称3',
                        params: '参数3',
                        remark: '备注大概还得到广大该活动该活动改3'
                    }
                ],
        }
    },
    methods: {
        /*ztree孩子调用父组件事件*/
        updateDetail: function (data) {
            this.getInfo(data)
        },
        goDetail: function (locationid) {
            this.chooseEqItem.locationid = locationid
            this.post(this.INTERFACE.getLocationsTreeParentByParams, {id: locationid}, (isSuccess, res) => {
                if (isSuccess) {
                    this.$refs.zTree.freshArea(res)
                    this.$refs.zTree.setId(locationid, false)
                }
            }, true)
            this.getInfo(locationid)
            this.isShow = !this.isShow  
        },
        getInfo: function (locationid) {
            var params2 = {
                locationId: locationid
            }
            /*获取资产信息*/
            this.post(this.INTERFACE.getAssetByLocationId, params2, (isSuccess, res) => {
                if (isSuccess) {
                    this.assetInfo = res
                    /*获取部件列表*/
                    var _params = {
                        assetId: this.assetInfo.id,
                        pageIndex: 1,     /*页码: 1*/
                        pageSize: 5      /*每页显示记录数量: 3*/
                    }
                    this.post(this.INTERFACE.queryAssetComponentByAssetId, _params, (isSuccess, res) => {
                        if (isSuccess) {
                            this.partList = res.rows
                        }
                    },true)
                }
            }, true)
            var params1 = {
                id: locationid
            }
            this.post(this.INTERFACE.getLocationById, params1, (isSuccess, res) => {
                if (isSuccess) {
                    /*设置路径为可使用数据*/
                    res.locations = res.LOCATIONFULLPATH.split('/')
                    if (res.MAINTENANCEUNIT === null) {
                        if (res.MAINTENANCEDEPARTMENT === null) {
                            res.checkUnit = '无'
                        } else {
                            res.checkUnit = res.MAINTENANCEDEPARTMENT
                        }
                    } else {
                        if (res.MAINTENANCEDEPARTMENT === null) {
                            res.checkUnit = res.MAINTENANCEUNIT
                        } else {
                            res.checkUnit = res.MAINTENANCEUNIT + '、' + res.MAINTENANCEDEPARTMENT
                        }
                    }
                    if (res.OPERATIONUNIT === null) {
                        if (res.OPERATIONDEPARTMENT === null) {
                            res.runUnit = '无'
                        } else {
                            res.runUnit = res.OPERATIONDEPARTMENT
                        }
                    } else {
                        if (res.OPERATIONDEPARTMENT === null) {
                            res.runUnit = this.ELE_DICTIONARY[res.OPERATIONUNIT]
                        } else {
                            res.runUnit = this.ELE_DICTIONARY[res.OPERATIONUNIT] + '、' + res.OPERATIONDEPARTMENT
                        }
                    }
                    this.functionInfo = res
                    console.log(JSON.stringify("获取功能位置信息" + JSON.stringify(this.functionInfo)))
                }
            }, true)
        },
        formatter(row, column) {
            return row.address;
        },
        showMoreTypeList: function () {
            this.isMoreTypeList = !this.isMoreTypeList
            this.show_typeList = this.typeList
        },
        /*将接口数组转化为ztree列表可执行*/
        resizeZtreeList: function (obj) {
            var zNode = []
            obj.forEach( (i) => {
                var item = {
                    id: i.id,
                    name: i.name,
                    open: false,
                    icon: i.icon,
                    children: null
                }
                if (i.haschildren !== '0') {
                    /*如果当前存在孩子节点,设置其状态[],表示有孩子*/
                    item.children = []
                }
                zNode.push(item)
            })
            return zNode
        },
        /*初始化ztree数据*/
        initZtreeData: function (obj) {
            var zNode = this.resizeZtreeList(obj)
            /*默认加载第一个父亲下所有子节点,因为默认选中第一个父亲,选中即为点击状态,点击自然显示下拉*/
            /*获取第一个节点功能id*/
            var firstZNodeId = zNode[0].id
            /*先判断是否第一个存在*/
            var params = {
                parentid: firstZNodeId
            }
            this.getInfo(firstZNodeId)
            this.post(this.INTERFACE.getLocationsTreeByParams, params, (isSuccess, res) => {
                if (isSuccess) {
                    zNode[0].children = this.resizeZtreeList(res)
                    console.log("要是树数据:" + JSON.stringify(zNode))
                    /*渲染所有节点数据*/
                    this.$refs.zTree.freshArea(zNode)
                    this.$refs.zTree.setId(firstZNodeId, true)
                }
            }, true)
        },
    },
    mounted: function () {
        console.log(this)
    },
    created: function () {
        /*获取树列表数据*/
        this.post(this.INTERFACE.getLocationsTreeByParams, {}, (isSuccess, res) => {
            if (isSuccess) {
                this.initZtreeData(res)
            }
        }, true)
    }
}
</script>
<style scoped>
    /* 倒三角形 start */
    .triangle_border_down{
        left: -7px;
        top: -1px;
        width: 0;
        height: 0;
        border-width: 12px 12px 0;
        border-style: solid;
        border-color: transparent transparent transparent;
        position: relative;
    }
    .triangle_border_down span{
        display: block;
        width: 0;
        height: 0;
        border-width: 10px 9px 0;
        border-style: solid;
        border-color: #09AFE5 transparent transparent;
        position: absolute;
        top: -11px;
        left: -12px;
    }
    .newsItem .newsArea{
        width: 339px;
        background: rgba(255,255,255,1);
        box-shadow: 1px 2px 13px 1px rgba(204,204,204,0.82);
        padding: 5px 15px;
    }
    .newsItem .newsTitle{
        padding-bottom: 10px;
        border-bottom: 1px dotted #B7B7B7;
        margin-bottom: 10px;
    }
    .newsItem{
        border-left: 4px solid rgba(9,175,229,1);
        position: relative;
        padding: 0px 10px 8px 17px;
        min-height: 50px;
        box-shadow: -11px 0px 10px -10px rgba(51,163,255,0.4);
    }
    .newsItem .title{
        position: relative;
        top: -6px;
    }
    .newsItem .time{
        position: relative;
        top: -9px;
    }
    .newsPoint{
        width: 10px;
        height: 10px;
        left: -7px;
        top: 0px;
        border-radius: 50%;
        position: absolute;
        z-index:1;
        box-shadow: 0px 0px 1px 1px rgba(51,163,255,0.4);
    }
    .newsPoint_choose{
        padding: 3px;
        border: 2px solid #09AFE5;
        left: -11px;
        top: 0px;
        border-radius: 50%;
        position: absolute;
        z-index: 1;
        background: #fff;
        box-shadow: 0px 0px 1px 1px rgba(51,163,255,0.4);
    }
    .newsPoint_choose .point{
        background: #09AFE5;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
    .newsItem .date{
        position: absolute;
        z-index: 1;
        left: -82px;
        top: -3px;
        color: #09AFE5;
    }
    .flow{
        padding-left: 130px;
    }
    /* 界面宽度需求限制  start*/
    .equipmentAccountInquiry{
        min-width: 1012px;
    }
    .cardShow.boxshadow.tab{
        padding-top: 1px !important;
    }
    .cardShow{
        min-width: 781px;
    }
    .dataShow{
        min-width: 450px;
    }
    .functionShow{
        width: 260px;
        display: inline-block;
        vertical-align: top;
        border: 1px dotted #ccc;
        margin-right: 20px;
    }
    .functionShow ._main{
        padding: 0 10px;
        padding-top: 20px
    }
    .functionShow ._main .imgArea{
        width: 140px;
        height: 140px;
        margin: auto;
    }
    .functionShow img{
        width: 100%;
        height: 100%;
    }
    .functionShow ._main .imgList{
        padding: 20px 0px;
        text-align: center;
    }
    .functionShow ._main .imgList .iconImg{
        width: 25px;
        height:25px;
        display: inline-block;
        margin-right: 5px;
        padding: 1px;
        border: 1px solid #000;
    }
    .functionShow ._main .imgList .iconImg:nth-last-child(2){
        margin-right: -2px;
    }
    .functionShow ._main .imgList .iconImg .icon{
        fill: #ccc
    }  
    .function .dataShow{
        width: calc(100% - 285px);
        display: inline-block;
    }
    .function .dataShow span{
        color: #6a6a6a;
    }
    .dataShow .catalog .locations .item:last-child .icon{
        display: none;
    }
    .catalog .item span{
        color: #333;
        font-weight: 600;
    }
    .catalog .icon{
        width: 1em;
    }
    /* 数据列表展示(灰色),左右列 start */    
    .spanCol:after,
    .spanCol2:after{
        content: ".";        
        display: block;        
        height: 0;        
        clear: both;        
        visibility: hidden;
    }
    .spanCol2 p:first-child{
        display: inline-block;
        min-width: 230px;
    }
    .large .spanCol2 p:first-child{
        min-width: 300px;
    }
    .spanCol p, .spanCol2 p{
        float: left;
    }
    .spanCol span, .spanCol2 span{
        color: #6a6a6a;
    }
    .spanCol p span:first-child, .spanCol2 p span:first-child{
        padding-right: 5px;
    }
    /* 数据列表展示(灰色),左右列 end */
    .equimentInfo{
        padding: 0px 15px;
    }
    .line{
        height: 1px;
        background: #dedede;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .icon{
        fill: #09AFE5;
    }
    .tab{
        width: calc(100% - 220px);
        float: right;
        height: calc(100vh - 153px);
        overflow: auto;
    }
    .fade-enter-active {
        transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .fade-leave-active {
        transition: transform 0.6s ease-out, opacity 0.4s ease-out;
    }
    /* 评价列表图片模块 start*/
    .comment .imgList{
        margin-bottom: 10px;
    }
    .comment .imgList .item{
        display: inline-block;
        padding: 3px;
        border: 3px solid #f2f2f2;
        margin-right: 10px;
    }
    .comment .imgList .item:last-child{
        margin-right: 0px;
    }
    .comment .imgList .item ._main{
        width: 70px;
        height: 70px;
    }
    .comment .imgList .item ._main img{
        width: 100%;
        height: 100%;
    }
    /* 评价列表图片模块 end*/
    .commentArea .allType{
        background: #fcfcfc;
        border: 1px solid rgb(238, 238, 238);
        padding: 10px 0px;
        margin-bottom: 15px;
    }
    .commentArea .allType .section1{
        background: #fff;
        width: 150px;
        display: inline-block;
        vertical-align: middle;
        text-align: center
    }
    .commentArea .allType .section1 .fontLarge{
        font-weight: 500;
        font-size: 24px
    }
    .commentArea .allType .section2{
        width: calc(100% - 280px);
        display: inline-block;
        vertical-align: middle;
    }
    .commentArea .allType .section3{
        display: inline-block;
        border: 1px solid #d6d6d6;
        background: #f3f3f3;
    }
    .commentArea .allType .section3 .word{
        height: 100%;
        display: inline-block;    
        padding: 4px 8px;
    }
    .commentArea .allType .section3 .op{
        width: 20px;
        height: 100%;
        display: inline-block;
        text-align: center;
        vertical-align: bottom;
    }
    .commentArea ._main .userInfo{
        width: 150px;
        display: inline-block;
        vertical-align: top;
        text-align: center
    }
    .commentArea ._main .userInfo .imgArea{
        width: 40px; 
        height: 40px;
        margin: auto;
        padding-bottom: 5px
    }
    .commentArea ._main .userInfo .imgArea img{
        width: 100%;
        height: 100%
    }
    .commentArea ._main .goodsInfo{
        width: calc(100% - 160px);
        display: inline-block
    }
       
    .form-check{
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 0px;
    }
    .form-check:last-child{
        margin-right: 0px
    }
    @media screen and (max-width: 1280px) {
        .equipmentAccountInquiry{
            min-width: 940px;
        }
        .cardShow {
            min-width: 735px;
        }
        .dataShow{
            min-width: 420px;
        }
    }
</style>
<style>
    #treeDemo{
        height: calc(100vh - 153px);
        /*height: calc(100vh - 440px);*/
    }
    .equipmentAccountInquiry *{
        font-size: 14px;
        font-family: 'PingFangSC-Regular';
    }
    .equipmentAccountInquiry .vue-tabs .nav-tabs-navigation{
        margin-bottom: 30px;
        position: fixed;
        /*position: absolute;*/
        /*min-width: 700px;*/
        width: calc(100% - 536px);
        background: #fff;
        padding-top: 10px;
        margin-top: -1px;
        z-index: 2;
    }
    .equipmentAccountInquiry .vue-tabs .tab-content{
        padding-top: 67px;
    }
    .equipmentAccountInquiry .vue-tabs .tab-content .tab-container{
        width: 100%;
    }
    .equipmentAccountInquiry .el-table th.is-leaf {
        border-right: 1px solid #ebeef5;
    }
    .equipmentAccountInquiry .el-table th.is-leaf:last-child {
        border-right: none;
    }
    .equipmentAccountInquiry .el-table thead tr th:first-child {
         padding-left: 0px; 
    }
    .equipmentAccountInquiry .el-table tr td:not(first-child) .cell{
        padding-left: 0px;
    }
    .equipmentAccountInquiry .searchArea{
        width: 145px;
    }
    .equipmentAccountInquiry .searchArea .el-input__inner{
        height: 30px;
        line-height: 30px;
    }
    .equipmentAccountInquiry .searchArea .el-input__icon{
        line-height: 30px;
    }
</style>
