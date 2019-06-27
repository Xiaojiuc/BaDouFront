{
    type : {
        func : function (data){
            var chartOptions = {
                title: {
                    text: '',
                    textStyle: {
                        color:'#000'
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data:[],
                    textStyle: {
                        color: '#000'
                    }
                },
                label:{            //饼图图形上的文本标签
                    normal:{
                        show:true,
                        position:'top', //标签的位置
                        distance : 15 ,
                        textStyle : {
                            //color:"#fff",
                            fontWeight : 300 ,
                            fontSize : 22    //文字的字体大小
                        },
                    }
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:"#000"
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#000'
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                type:'dotted',
                                color:"#ccc"
                            }
                        },
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
//			            show : false ,
                        axisLine:{
                            lineStyle:{
                                type:'dotted',
                                color:"#000"
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                type:'dotted',
                                color:"#ccc"
                            }
                        }
                    }
                ],
                series : []
            };

            if(data.chartOptions)
                $.extend(chartOptions, data.chartOptions);
            /*增加功能 优先级最高 重新定义报表设置*/
            evalJs(chartOptions,false);

            var base = {
                $element:null,
                reportId:null,
                echart:null,
                dataDef : null,
                panelFilterReportId: null,
                options:chartOptions,
                dataSourceId : null,
                dataSourceType :null,
                reportShowTypeId: null,
                load:function(params){
                    var g = this;
                    this.echart = echarts.init(data.$element);
                    Vue.prototype.post(
                        Vue.prototype.INTERFACE.packData,
                        {
                            dataSourceId : this.dataSourceId,
                            dataSourceType : this.dataSourceType,//[filter||report]
                            reportShowTypeId: this.reportShowTypeId,
                            dataDef : this.dataDef,
                            params:params
                        },
                        (isSuccess, res) => {
                            if( res.bean.data != null &&  res.bean.data != undefined){
                                g.renderChartsData(res.bean.data);
                           }else{
                               data.$element.innerHTML='<div class="noDataIconArea"><i class="fa fa-frown-o noDataIcon"></i><div class="noData">暂无数据</div></div>';
                           }
                        },
                        true
                      );  
                },
                renderChartsData: function(data) {
                    var g = this;
                    if(data){
                        g.options.xAxis[0].data = data.cate;
                        var seriesArr = data.series;
                        for(var i = 0 ; i < seriesArr.length ; i++ ){
                            g.options.series.push({	name : seriesArr[i].name,  type:'line', areaStyle: {normal: {}}, stack: '总计', data : seriesArr[i].data});
                        }
                        g.options.legend.data = data.legend;
                        evalJs(g.options,true);
                        this.echart.setOption(g.options,true);
                    }
                }
            }
            $.extend(base,data);
            return base;
        }
    }
}