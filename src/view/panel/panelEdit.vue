<template>
  <div id="chartVue">
    <div class="header-settings">
      <span v-if="isEdit" class="header-select">
            <el-select v-model="layoutId" @change="changePanel">
                  <el-option
                    v-for="panel in panelList"
                    :label="panel.name"
                    :value="panel.id"
                    :key="panel.id"
                  ></el-option>
                  <el-option label="==添加面板==" value=""></el-option>
            </el-select>
      </span>
      <span class="header-btn" @click="changePanelInfo" title="设置面板">
        <i class="el-icon-setting"></i>
      </span>
      <span v-if="layoutId !== ''" class="header-btn" @click="savePosition" title="保存位置">
        <i class="el-icon-rank"></i>
      </span>
      <span v-if="layoutId !== ''" class="header-btn" @click="addBlock" title="添加块">
        <i class="el-icon-plus"></i>
      </span>
    </div>
    <panel-dialog
      :setDialogVisible="setDialogVisible"
      :layoutTypelist="layoutTypelist"
      :templatelist="templatelist"
      @dialogContro="setDialogVisible=false"
      @setPanelInfo="setPanelInfo"
      ref="layout"
    ></panel-dialog>
    <power-drag
      ref="cyGridster"
      :your-list="blocks"
      :base-margin-left="baseMarginLeft"
      :base-margin-top="baseMarginTop"
      :base-width="baseWidth"
      :base-height="baseHeight"
      :drag-start="dragStart"
      :dragging="dragging"
      :drag-end="dragEnd"
      :resize-start="resizeStart"
      :resizing="resizing"
      :resize-end="resizeEnd"
    >
      <template v-for="(item,index) in blocks" :slot="'slot'+index">
        <div class="dragHandle" :key="index">
          <div class="tool">
            <div class="block-title" v-if="item.flgShowTitleBar === '1'">
              <i :class="item.blockIcon?item.blockIcon:'fa fa-bar-chart'"></i>
              <span>{{item.title}}</span>
            </div>
            <div class="block-setting">
              <span class="span-float" @click="deleteBlock(item.id,index)">
                <i class="el-icon-delete"></i>
              </span>
              
              <span class="span-float" @click="changeBlockInfo(item)">
                <i class="el-icon-setting"></i>
              </span>
            </div>
          </div>
          <div v-if="item.isContentGroup" style="height: 100%;margin-top: 8px;">
            <div :ref="'carousel-example-generic_'+item.id" :id="'carousel-example-generic_'+item.id" class="carousel slide" data-ride="carousel" :data-interval="item.pitchTime === 0?5000:item.pitchTime" v-if="item.shouType === '1'" style="height: 100%;">
                <div class="carousel-inner" role="listbox" style="height: 100%;">
                    <div class="carousel-item" v-for="(content,idx) in item.comboContentData" :key="content.id" :class="{active: idx === 0}" style="height: 100%;">
                        <div :ref="'block-groupcontent_'+content.id"></div>
                    </div>
                </div>
                <a class="carousel-control-prev" :href="'#carousel-example-generic_'+item.id" data-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </a>
                <a class="carousel-control-next" :href="'#carousel-example-generic_'+item.id" data-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </a> 
            </div>
            <div class="row" v-else>
                <div class="col-sm-4" :ref="'block-groupcontent_'+content.id" v-for="content in item.comboContentData" :key="content.id"></div>
            </div>
        </div>
        <div v-else-if="item.isContentPictures" style="height: 100%;margin-top: 8px;">
            <div class="shutter" v-if="item.shouType === '1'">
                <div class="shutter-img">
                    <a v-for="content in item.comboContentData" :key="content.id"><img :src="downloadFile+content.multiImage"></a>
                </div>
                <ul class="shutter-btn">
                    <li class="prev"></li>
                    <li class="next"></li>
                </ul>
            </div>
            <div class="row" v-else>
                <div class="col-sm-4" v-for="content in item.comboContentData" :key="content.id">
                    <img :src="downloadFile+content.multiImage" style="height: 100%;width: 100%;">
                </div>
            </div>
        </div>
        <div class="chart" :ref="'chart'+index" v-else></div>
        </div>
      </template>
    </power-drag>
    <panel-form
      :dialogFormVisible="dialogFormVisible"
      :reportlist="reportlist"
      :typelist="typelist"
      :pagelist="pagelist"
      :filterList="filterList"
      :shareArray="shareArray"
      @changeVisible="dialogFormVisible=false"
      @reloadBlock="reloadBlock"
      ref="panel"
    ></panel-form>
  </div>
</template>

<script>
let echarts = require('echarts')

import {Select, Option} from 'element-ui'
import drag from 'src/components/drag/drag.vue'
import mock from 'mockjs'
import _ from 'lodash'
import genCharts from 'src/components/panel/panel.js'
import oldCharts from 'src/components/panel/oldPanel.js'
import panelForm from 'src/components/panel/panelForm.vue'
import panelEditUtil from 'src/components/panel/panelEditUtil.js'
import 'src/js/map/guangdong.js'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'
import PanelDialog from '../../components/panel/panelDialog.vue'

import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.min.js' 
import 'bootstrap-table/dist/bootstrap-table.min.css' 
import 'bootstrap-table/dist/bootstrap-table.min.js' 
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js'

import 'src/components/panel/shutter/css/shutter.css'
import 'src/components/panel/shutter/js/velocity.js'
import 'src/components/panel/shutter/js/shutter.js'

export default {
    data () {
        return {
            blocks: [],
            baseWidth: 0,
            baseHeight: 0,
            dialogFormVisible: false,
            reportlist: [],
            typelist: [],
            pagelist: [],
            filterList: [],
            layoutTypelist: [],
            templatelist: [],
            setDialogVisible: false,
            layoutId: '',
            shareArray: [],
            panelList: [],
            isEdit: false,
            downloadFile: this.INTERFACE.downloadFile
        }
    },
    components: {
        'power-drag': drag,
        panelForm,
        PanelDialog,
        [Select.name]: Select,
        [Option.name]: Option
    },
    name: 'panel-edit',
    methods: {
        /**
        e: 事件对象
        item：拖动对象
        index：拖动对象下标
        */
        dragStart (e, item, index) {},
        dragging (e, item, index) {},
        dragEnd (e, item, index) {},
        resizeStart (e, item, index) {},
        resizing (e, item, index) {},
        resizeEnd (e, item, index) {},

        /* 编辑面板 */
        changePanelInfo () {
            this.setDialogVisible=true
            this.$refs['layout'].initDialog(this.layoutId)
        },

        /* 编辑块 */
        changeBlockInfo (item) {
            this.dialogFormVisible = true
            this.$refs['panel'].genItem(item)
        },

        /* 保存块的位置 */
        savePosition () {
            let datas = []
            for (let i in this.blocks) {
                let data = {
                    id: this.blocks[i].id,
                    col: this.blocks[i].x,
                    row: this.blocks[i].y,
                    sizex: this.blocks[i].sizex,
                    sizey: this.blocks[i].sizey
                }
                datas.push(data)
            }
            this.post(
                this.INTERFACE.savePanelPos,
                { data : JSON.stringify(datas) },
                (isSuccess, res) => {
                    this.alert('保存成功', 'success')
                    this.reloadBlock()
                },
                true
            )
        },

        /* 重新加载块 */
        reloadBlock () {
            this.blocks = []
            this.loadBlock()
        },

        /* 新增块 */
        addBlock () {
            this.dialogFormVisible = true
            let item = {
                name: null,
                title: null,
                x: 1,
                y: 1,
                sizex: 1,
                sizey: 1,
                contentType: null, 
                dataSourceType: null,
                reportId: null,
                isSingle: true,
                type: null,
                chartSourceId: null,
                chartSourceType: null,
                reportFields: null,
                width: null,
                height: null,
                topDistance: null,
                rightDistance: null,
                bottomDistance: null,
                leftDistance: null,
                flgShowTitleBar: null,
                blockIcon: null,
                blockTitleColor: null,
                blockTitleFontColor: null,
                flgShowBorder: null,
                borderType: null,
                blockBorderColor: null,
                blockChartOptions: null,
                reloadTime: null,
                shouType: null,
                changeType: null,
                pitchTime: null,
                pageId: null,
                panelFilterReportId: null,
                videoURL: null,
                videoWidth: null,
                videoHeight: null,

                previewImg: null,
                backgroundImg: null,

                layoutId: this.layoutId,
                newBlock: true,

                chartColor: null,
                chartLegendFontColor: null,
                code: null,
                layoutName: null,
                pageName: null,
                pageURL: null,
                priority: null,
                refer: null,

                comboContentData: []
            }
            this.$refs['panel'].genItem(item)
        },

        /* 删除块 */
        deleteBlock (id, index) {
            this.$confirm('确定删除吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.post(
                    this.INTERFACE.deleteBlock,
                    { ids: id },
                    (isSuccess, res) => {
                        if (isSuccess) {
                            let gridster = this.$refs['cyGridster'] //获取gridster实例
                            gridster.removeItem(index) //此时会在this.myList的index位置将item置为{}，目的是为了不让vue重新渲染整个v-for
                        }
                    },
                    true
                )
            }).catch(() => {})
        },

        /* 根据类型渲染图表 */
        async singleContent ($targetObj, content, chartOptions, panelFilterReportId) {
            let reportId = content.reportId
            let type = content.type
            let xFieldName = content.xfieldName + '_' + content.xdisplayName
            let yFieldName = content.yfieldName + '_' + content.ydisplayName
            let yAxisUnit = content.yaxisUnit
            let mapType = content.mapType
            let staticsFieldName = ''
            if (content.staticsFieldName)
                staticsFieldName = content.staticsFieldName + '_' + content.staticsDisplayName
            let chartObj = null
            //判断是否为原来默认的类型 原来的类型ID为数字
            if (type.length < 64) {
                type = parseInt(type)
            }

            switch (type) {
                case 2:
                chartObj = oldCharts.initBar({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    staticsFieldName: staticsFieldName,
                    yAxisUnit: yAxisUnit,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                case 3:
                chartObj = oldCharts.initLine({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    staticsFieldName: staticsFieldName,
                    yAxisUnit: yAxisUnit,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                case 4:
                chartObj = oldCharts.initPie({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                case 9:
                chartObj = oldCharts.initStackArea({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                case 12:
                chartObj = oldCharts.initRadar({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                case 15:
                chartObj = oldCharts.initStackBar({
                    $element: $targetObj,
                    reportId: reportId,
                    xFieldName: xFieldName,
                    yFieldName: yFieldName,
                    yAxisUnit: yAxisUnit,
                    chartOptions: chartOptions,
                    panelFilterReportId: panelFilterReportId
                })
                break
                default:
                chartObj = await genCharts.genChartsObj({
                    reportShowTypeId: type,
                    $element: $targetObj,
                    reportId: reportId,
                    panelFilterReportId: panelFilterReportId,
                    dataDef: content.dataDef,
                    chartOptions: chartOptions
                })
            }
            chartObj.load()
        },
        
        /* 渲染图表 */
        dealWithReport (item, isSingle, index) {
            let chartOptions = {
                color: [
                '#5ab1ef',
                '#b6a2de',
                '#ffb980',
                '#97b552',
                '#95706a',
                '#8d98b3',
                '#dc69aa',
                '#e5cf0d',
                '#91c7af',
                '#d87a80',
                '#2ec7c9'
                ],
                legend: {
                    textStyle: {
                        //图例文字的样式
                        color: '#000',
                        fontSize: 12
                    }
                },
                tempChartOptions: null
            }
            if (item.blockChartOptions !== null && item.blockChartOptions !== undefined && item.blockChartOptions !== '')
                chartOptions.tempChartOptions = item.blockChartOptions
            if (item.chartColor !== null && item.chartColor !== undefined && item.chartColor !== '') {
                let tempStr = item.chartColor.replace(/[\"']/g, '')
                chartOptions.color = tempStr.split(',')
            }
            if (item.chartLegendFontColor !== null && item.chartLegendFontColor !== undefined && item.chartLegendFontColor !== '') {
                chartOptions.legend.textStyle.color = item.chartLegendFontColor
            }

            let $obj = null
            if (isSingle) {
                $obj = this.$refs['chart' + index][0]
            } else {
                let $item = this.$refs['cyGridster'].$refs['item' + index][0]
                let tempWidth = $item.style.width
                let tempHeight = $item.style.height
                $obj = this.$refs['block-groupcontent_' + item.id][0]
                $obj.style.width = parseInt(tempWidth) - 3 * 16 + 'px'
                $obj.style.height = parseInt(tempHeight) - 3 * 16 + 'px'
            }

            let content = item.contents[0]
            this.singleContent($obj, content, chartOptions, item.panelFilterReportId)
        },

        /* 渲染页面 */
        dealWithPage (item, isSingle, index) {
            if (item.pageId !== null && item.pageId !== '') {
                this.post(
                    this.INTERFACE.getUrl,
                    { id: item.pageId },
                    (isSuccess, res) => {
                        let url = res
                        if (url.indexOf('http') !== 0) {
                            url = this.BASEURL + '/' + url
                        }
                        if (url.indexOf('?') < 0) {
                            url = url + '?'
                        }
                        let html = '<div style="height: 100%;"><iframe src="'
                                + url + '&canvasId=' 
                                + item.id + '_div" width="100%" height="100%" frameborder="0" scrolling="yes" id="' 
                                + item.id + '_frame" name="' 
                                + item.pageId + '_frameName" allowtransparency="true" style="min-height:576px"></iframe></div>'
                        let $obj = null
                        if (isSingle) {
                            $obj = this.$refs['chart' + index][0]
                        } else {
                            $obj = this.$refs['block-groupcontent_' + item.id][0]
                        }
                        $obj.innerHTML = html
                    },
                    true
                )
            }else if (item.pageURL != null && item.pageURL != "") {
                let url = item.pageURL
                if (url.indexOf('http') !== 0) {
                    url = this.BASEURL + '/' + url
                }
                if (url.indexOf('?') < 0) {
                    url = url + '?'
                }
                let html = '<div style="height: 100%;"><iframe src="'
                        + url + '&canvasId=' 
                        + item.id + '_div" width="100%" height="100%" frameborder="0" scrolling="yes" id="' 
                        + item.id + '_frame" name="' 
                        + item.pageId + '_frameName" allowtransparency="true" style="min-height:576px"></iframe></div>'
                let $obj = null
                if (isSingle) {
                    $obj = this.$refs['chart' + index][0]
                } else {
                    $obj = this.$refs['block-groupcontent_' + item.id][0]
                }
                $obj.innerHTML = html
            }
        },

        /* 生成组合内容 */
        dealWithContentGroup (comboContentData, index) {
            for (let i in comboContentData) {
                // 根据content生成临时item
                let tempItme = {}
                if (comboContentData[i].dataSourceType === '1') {
                    tempItme = {
                        id: comboContentData[i].id,
                        pageId: comboContentData[i].pageId,
                        pageURL: comboContentData[i].pageURL
                    }
                    this.dealWithPage(tempItme, false, index)
                } else if (comboContentData[i].dataSourceType === '4') {
                    //this.dealWithVideo(tempItme, false, index)
                } else {
                    tempItme = {
                        id: comboContentData[i].id,
                        panelFilterReportId: comboContentData[i].filterReportId,
                        contents: [comboContentData[i]]
                    }
                    this.dealWithReport(tempItme, false, index)
                }
            }
        },

        dealWithContentPictures () {
            $('.shutter').shutter({
                shutterW: '100%', // 容器宽度
                shutterH: '100%', // 容器高度
                isAutoPlay: true, // 是否自动播放
                playInterval: 3000, // 自动播放时间
                curDisplay: 3, // 当前显示页
                fullPage: false, // 是否全屏展示
				moveType : null, // [0:13] 14种切换方式 需要自己体会 null为随机
			
            });
        },

        /* 加载块 */
        loadBlock () {
            let params = {
                isWorkBeanch: true,
                layoutId: this.layoutId
            }

            let vm = this
            vm.post(
                vm.INTERFACE.loadBlock,
                params,
                (isSuccess, res) => {
                if (isSuccess) {
                    _.forEach(res, function(item, index) {
                        let dataSourceType = '0'
                        if (panelEditUtil.isPage(item)) {
                            dataSourceType = '1'
                        } else if (panelEditUtil.isFilter(item)) {
                            dataSourceType = '2'
                        } else if (panelEditUtil.isVideo(item)) {
                            dataSourceType = '4'
                        } else {
                            dataSourceType = '0'
                        }
                        let isSingle = false
                        if (item.contents && item.contents.length === 1) {
                            isSingle = true
                        }
                        let reportId = null
                        let chartSourceId = ''
                        let chartSourceType = ''
                        let reportFields = {}
                        let type = ''
                        let videoURL = ''
                        let videoWidth = ''
                        let videoHeight = ''
                        if(item.contents && item.contents.length > 0){
                            type = item.contents[0].type
                            videoURL = item.contents[0].videoURL
                            videoWidth = item.contents[0].videoWidth
                            videoHeight = item.contents[0].videoHeight
                            if (item.panelFilterReportId !== null && item.panelFilterReportId !== undefined && item.panelFilterReportId !== '') {
                                chartSourceId = item.filterId
                                chartSourceType = 'filter'
                            } else if (item.contents[0].reportId !== null && item.contents[0].reportId !== undefined && item.contents[0].reportId !== '') {
                                reportId = item.contents[0].reportId
                                chartSourceType = 'report'
                            }
                            //根据dataDef生成报表字段
                            if (item.contents[0].dataDef !== null && item.contents[0].dataDef !== undefined && item.contents[0].dataDef !== '') {
                                let obj = JSON.parse(item.contents[0].dataDef)
                                for (let key in obj) {
                                    if(obj[key].length === 0){
                                        reportFields[key] = ''
                                    }else if (obj[key].length === 1) {
                                        reportFields[key] = obj[key][0]['fieldName']
                                        //组装操作（count/sum）数据
                                        if(obj[key][0]['oper'] !== undefined){
                                            let longKey = key + '_'+ reportFields[key] + '_oper'
                                            reportFields[longKey] = obj[key][0]['oper']
                                        }
                                    } else {
                                        let list = obj[key]
                                        let subList = []
                                        for (let i in list) {
                                            //组装操作（count/sum）数据
                                            if(list[i]['oper'] !== undefined){
                                                let longKey = key + '_'+ list[i]['fieldName'] + '_oper'
                                                reportFields[longKey] = list[i]['oper']
                                            }
                                            subList.push(list[i]['fieldName'])
                                        }
                                        reportFields[key] = subList
                                    }
                                }
                            }
                        } 

                        let isContentGroup = panelEditUtil.isContentGroup(item)
                        let isContentPictures = panelEditUtil.isContentPictures(item)
                        let pageId = item.pageId
                        if (item.pageId === '' && item.pageURL !== '') {
                            pageId = '0'
                        }
                        
                        let block = {
                            id: item.id,
                            name: item.name,
                            title: item.name,
                            x: item.col,
                            y: item.row,
                            sizex: item.sizex,
                            sizey: item.sizey,
                            contentType: item.contentType, //内容类型 0 单一内容 1 组合内容 2 多图片
                            dataSourceType: dataSourceType,
                            reportId: reportId,
                            isSingle: isSingle,
                            type: type,
                            chartSourceId: chartSourceId,
                            chartSourceType: chartSourceType,
                            reportFields: reportFields,
                            width: item.width,
                            height: item.height,
                            topDistance: item.topDistance,
                            rightDistance: item.rightDistance,
                            bottomDistance: item.bottomDistance,
                            leftDistance: item.leftDistance,
                            flgShowTitleBar: item.flgShowTitleBar,
                            blockIcon: item.blockIcon,
                            blockTitleColor: item.blockTitleColor,
                            blockTitleFontColor: item.blockTitleFontColor,
                            flgShowBorder: item.flgShowBorder,
                            borderType: item.borderType,
                            blockBorderColor: item.blockBorderColor,
                            blockChartOptions: item.blockChartOptions,
                            reloadTime: item.reloadTime,
                            shouType: item.shouType,
                            changeType: item.changeType,
                            pitchTime: item.pitchTime,
                            pageId: pageId,
                            panelFilterReportId: item.panelFilterReportId,
                            videoURL: videoURL,
                            videoWidth: videoWidth,
                            videoHeight: videoHeight,

                            previewImg: item.previewImg,
                            backgroundImg: item.backgroundImg,

                            layoutId: item.layoutId,
                            newBlock: false,

                            chartColor: item.chartColor,
                            chartLegendFontColor: item.chartLegendFontColor,
                            code: item.code,
                            layoutName: item.layoutName,
                            pageName: item.pageName,
                            pageURL: item.pageURL,//页面
                            priority: item.priority,
                            refer: item.refer,

                            comboContentData: item.comboContentData,
                            isContentGroup: isContentGroup,
                            isContentPictures: isContentPictures
                        }
                        vm.blocks.push(block)
                    })
                    let gridster = vm.$refs['cyGridster'] //获取gridster实例
                    gridster.afterInitOk(function() {
                        _.forEach(res, function(item, index) {
                            if (panelEditUtil.isContentSingle(item)) {
                                if (panelEditUtil.isPage(item)) {
                                    vm.dealWithPage(item, true, index)
                                } else if (panelEditUtil.isVideo(item)) {
                                    //vm.dealWithVideo(item, true, index)
                                } else {
                                    vm.dealWithReport(item, true, index)
                                }
                            } else if (panelEditUtil.isContentGroup(item)) {
                                vm.dealWithContentGroup(item.comboContentData, index)
                            } else if (panelEditUtil.isContentPictures(item)) {
                                vm.dealWithContentPictures()
                            }
                        })
                    })
                    gridster.init()
                }
            },
            true
            )
        },

        /* 加载块的下拉框信息 */
        loadBlockSettingsInfo () {
            this.post(
                this.INTERFACE.findBlockSettingsInfo,
                {},
                (isSuccess, res) => {
                    this.reportlist = res.reportlist
                    this.typelist = res.typelist
                    this.pagelist = res.pagelist
                    this.filterList = res.filterList
                    if (this.layoutId === '') {
                        this.layoutId = res.layoutId
                    }
                    for (let i in res.layoutTypelist) {
                        res.layoutTypelist[i].id = res.layoutTypelist[i].id.toString()
                    }
                    this.layoutTypelist = res.layoutTypelist
                    this.templatelist = res.templatelist
                    this.shareArray = res.shareArray
                },
                true
            )
        },

        /* 加载当前用户面板 */
        loadPanelInfo () {
            this.post(
                this.INTERFACE.userLayouts,
                {},
                (isSuccess, res) => {
                    this.panelList = res
                },
                true
            )
        },

        /* 选择面板 */
        changePanel (value) {
            this.layoutId = value
            this.blocks = []
            if (value === ''){
                this.changePanelInfo()
            } else {
                this.loadBlock()
            }
        },


        setPanelInfo (panelInfo) {
            this.layoutId = panelInfo.id
            this.panelList.push(panelInfo)
        }
    },
    created () {
        //屏幕适配，使得当前布局能在所有分辨率下适用，示例是在1366*638分辨率下完成
        let screenWidth = window.innerWidth
        let screenHeight = window.innerHeight
        this.baseWidth = 70 * (screenWidth / 1366)
        this.baseHeight = 50 * (screenHeight / 638)
        this.baseMarginLeft = 5 * (screenWidth / 1366)
        this.baseMarginTop = 5 * (screenHeight / 638)

        this.$nextTick(function() {
            $('.dragAndResize').css(
                'width',
                'calc(100% - ' + this.baseMarginLeft + 'px)'
            )
        })
    },
    mounted () {
        let layoutId = this.$route.query.layoutId
        if (layoutId !== undefined) {
            this.isEdit = false
            this.layoutId = layoutId
        } else {
            this.isEdit = true
            this.loadPanelInfo()
        }
        this.loadBlock()
        this.loadBlockSettingsInfo()
    }
}
</script>

<style lang='less'>
body {
  overflow-x: hidden;
  & * {
    box-sizing: border-box;
  }
}

a {
  text-decoration: none;
  color: black;
}

#chartVue {
  width: 100%;
  padding: 1.5em 0 1.5em 0;
  .head {
    height: 50px;
    border-bottom: 1px dashed;

    b {
      cursor: pointer;
      font-weight: bold;
      margin-left: 1rem;
    }

    .arrow {
      font-size: 20px;

      position: relative;
      top: 2px;
      margin-right: 10px;
    }
  } //拖动布局容器样式
  .dragAndResize {
    //布局框样式
    .item {
      border-radius: 5px;
      border-color: #ccc;
    }
    .dragHandle {
      //拖动手柄样式
      padding: 1.5rem !important;
      height: 100%; //自定义内容样式
      .tool {
        position: absolute;
        left: 0.5rem;
        top: 0.5rem;
        cursor: pointer;
        font-weight: bold;
        right: 1%;
      }
      .chart {
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: default;
        margin-top: 8px;
      }
      .span-float {
        float: right;
        margin: 0 5px;
      }
      .block-title {
        float: left;
        margin: 5px;
      }
      .block-setting {
        float: right;
      }
    }
  }
}
.header-settings {
  width: 97%;
  height: 50px;
  background-color: white;
  padding-top: 5px;
  border: 0.55px solid #ccc;
  border-radius: 5px;
}
.header-settings .header-btn {
  float: right;
  margin-right: 18px;
  margin-top: 8px;
  cursor: pointer;
}
.table-bordered,.table-bordered > thead > tr > th,.table-bordered > tbody > tr > td{
    border:0px;
}
.table-bordered > thead > tr {
    border-bottom: 1px solid #E3E3E3;
}
.table-bordered > tbody > tr {
    border-top: 1px solid #E3E3E3;
}
.header-settings .header-select {
    margin-left: 18px;
}
</style>
