{
    type : {
        func : function (data){
            var chartOptions = {
                title: {
                    text: '',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#ccc'
                    }
                },

                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name:'',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[].sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0,0,0,0.5)'
                            }
                        },
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
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
                        (g.options.series)[0].data = data;

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