<template>
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
                <el-table :data="partList" style="width: 100%" border stripe :default-sort = "{prop: 'index', order: 'descending'}">
                  <el-table-column type="index" label="序号" width="70"></el-table-column>
                  <el-table-column prop="assetno" label="资产编号" sortable></el-table-column>
                  <el-table-column prop="description" label="描述" sortable></el-table-column>
                  <el-table-column prop="num" label="功能位置编码"></el-table-column>
                  <el-table-column prop="assetattr" label="资产级别"></el-table-column>
                  <el-table-column label="详情">
                    <template slot-scope="props">
                      <a class="btn-info btn-simple btn-link">详情</a>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div v-show='t.id == 3'>
            <el-table :data="paramsList" style="width: 100%" border stripe :default-sort = "{prop: 'index', order: 'descending'}">
              <el-table-column type="index" label="序号" width="70"></el-table-column>
              <el-table-column prop="type" label="产数类型" sortable></el-table-column>
              <el-table-column prop="name" label="产品名称" sortable></el-table-column>
              <el-table-column prop="params" label="参数值"></el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
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
</template>
<script>
  export default {
    data () {
      return {
        $Chartist: null
      }
    },
    methods: {
      initPerformanceChart () {
        const dataPerformance = {
          labels: ['6pm', '9pm', '11pm', '2am', '4am', '8am', '2pm', '5pm', '8pm', '11pm', '4am'],
          series: [
          [1, 6, 8, 7, 4, 7, 8, 12, 16, 17, 14, 13]
          ]
        }

        const optionsPerformance = {
          showPoint: false,
          lineSmooth: true,
          axisX: {
            showGrid: false,
            showLabel: true
          },
          axisY: {
            offset: 40

          },
          low: 0,
          high: 16,
          height: '250px'
        }

        this.$Chartist.Line('#chartPerformance', dataPerformance, optionsPerformance)
      },
      initActivityChart () {
        const data = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
          ]
        }

        const options = {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: '250px'
        }

        const responsiveOptions = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc (value) {
              return value[0]
            }
          }
        }]
        ]

        this.$Chartist.Bar('#chartActivity', data, options, responsiveOptions)
      },
      initStockChart () {
        const dataStock = {
          labels: ['\'07', '\'08', '\'09', '\'10', '\'11', '\'12', '\'13', '\'14', '\'15'],
          series: [
          [22.20, 34.90, 42.28, 51.93, 62.21, 80.23, 62.21, 82.12, 102.50, 107.23]
          ]
        }
        const optionsStock = {
          lineSmooth: false,
          axisY: {
            offset: 40,
            labelInterpolationFnc (value) {
              return `$${value}`
            }

          },
          low: 10,
          height: '250px',
          high: 110,
          classNames: {
            point: 'ct-point ct-green',
            line: 'ct-line ct-green'
          }
        }
        this.$Chartist.Line('#chartStock', dataStock, optionsStock)
      },
      initViewsChart () {
        const dataViews = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]
          ]
        }
        const optionsViews = {
          seriesBarDistance: 10,
          classNames: {
            bar: 'ct-bar'
          },
          axisX: {
            showGrid: false
          },
          height: '250px'
        }
        const responsiveOptionsViews = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc (value) {
              return value[0]
            }
          }
        }]
        ]
        this.$Chartist.Bar('#chartViews', dataViews, optionsViews, responsiveOptionsViews)
      },
      initCharts () {
        this.initPerformanceChart()
        this.initStockChart()
        this.initViewsChart()
        this.initActivityChart()
      }
    },
    async mounted () {
      this.$Chartist = await import('chartist')
      this.initCharts()
    }
  }
</script>
<style>
</style>
