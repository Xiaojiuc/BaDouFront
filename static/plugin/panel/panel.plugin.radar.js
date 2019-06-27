{
    type : {
        func : function (data){
            var chartOptions  = {
                title: {
                    text: ''
                },
                tooltip: {
                    show : true ,
                    axisPointer: {
                        type: 'shadow'
                    },
                    position: function(point, params, dom) {
                        return [point[0], '10%'];
                    }
                },
                legend: {
                    data: []
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#000',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    indicator: []
                },
                series: [{
                    type: 'radar',
                    // areaStyle: {normal: {}},
                    data : []
                }]
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
                        g.options.radar.indicator = data.indicator;
                        (g.options.series)[0].data = data.series;

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