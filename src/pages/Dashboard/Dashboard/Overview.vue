<template>
  <div id="chartVue">
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
      :draggable="draggable"
      :resizable="resizable"
    >
      <template v-for="(item, index) in blocks" :slot="'slot'+index">
        <div class="dragHandle" :key="index">
          <div class="tool" v-if="item.flgShowTitleBar == '1'">
            <div class="block-title">
              <i :class="item.blockIcon?item.blockIcon:'fa fa-bar-chart'"></i>
              <span>{{item.name}}</span>
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
  </div>
</template>

<script>
let echarts = require("echarts")

import drag from 'src/components/drag/drag.vue'
import mock from 'mockjs'
import _ from 'lodash'
import genCharts from 'src/components/panel/panel.js'
import oldCharts from 'src/components/panel/oldPanel.js'
import panelEditUtil from 'src/components/panel/panelEditUtil.js'
import 'src/js/map/guangdong.js'
import 'echarts-wordcloud/dist/echarts-wordcloud'
import 'echarts-wordcloud/dist/echarts-wordcloud.min'

import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.min.js' 
import 'bootstrap-table/dist/bootstrap-table.min.css' 
import 'bootstrap-table/dist/bootstrap-table.min.js' 
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js'

import 'src/components/panel/shutter/css/shutter.css'
import 'src/components/panel/shutter/js/velocity.js'
import 'src/components/panel/shutter/js/shutter.js'

export default {
    data() {
        return {
            blocks: [],
            baseWidth: 0,
            baseHeight: 0,
            draggable: false,
            resizable: false,
            downloadFile: this.INTERFACE.downloadFile
        }
    },
    components: {
        'power-drag': drag
    },
    name: 'panel-view',
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
        }
    },
    created() {
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
    mounted() {
        let params = {}
        let layoutId = this.$route.params.layoutId
        if (layoutId !== undefined) {
            params = { 
                isWorkBeanch: true,
                layoutId: layoutId
            }
        } else {
            params = { isWorkBeanch: true }
        }

        let vm = this
        vm.post(
            vm.INTERFACE.loadBlock,
            params,
            (isSuccess, res) => {
            if (isSuccess) {
                _.forEach(res, function(item, index) {
                    let isContentGroup = panelEditUtil.isContentGroup(item)
                    let isContentPictures = panelEditUtil.isContentPictures(item)
                    let block = {
                        id: item.id,
                        name: item.name,
                        x: item.col,
                        y: item.row,
                        sizex: item.sizex,
                        sizey: item.sizey,
                        blockIcon: item.blockIcon,
                        flgShowTitleBar: item.flgShowTitleBar,
                        isContentGroup: isContentGroup,
                        shouType: item.shouType,
                        comboContentData: item.comboContentData,
                        pitchTime: item.pitchTime,
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
      }
      .chart {
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: default;
        margin-top: 8px;
      }
      .block-title {
        float: left;
        margin: 5px;
      }
    }
  }
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
</style>
