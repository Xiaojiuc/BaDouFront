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
            //4.2.0-rc.2
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
                renderChartsData: function(datas) {
                    var g = this;
                    if(datas){
                        var series = [] ;
                        var currentLineIndex = 0;
                        for(var key = 0 ; key < datas.length ; key ++){
                            if(key % 3 == 0)
                                currentLineIndex ++ ;
                            var option = datas[key] ;
                            //	var centerWidth =  20 * (key % 3 + 1) + (key*10);
                            var centerWidth =  0;
                            if(key == 0 ){
                                centerWidth =  20;
                            }

                            if(key == 1 ){
                                centerWidth =  50;
                            }

                            if(key == 2 ){
                                centerWidth =  80;
                            }


                            /*	var centerWidth =  25 * (key + 1) ;*/
                            var centerHeight = 50 * currentLineIndex;
                            var ob = {};
                            var axisLine = {};
                            var lineStyle = {};
                            var axisLabel = {} ;
                            var textStyle = {} ;
                            var axisTick = {} ;
                            var axisTickLineStyle = {} ;
                            var title = {} ;
                            var titleTextStyle = {};
                            var splitLine = {} ;
                            var splitLineStyle = {} ;
                            var pointer = {} ;
                            var detail = {} ;
                            var detailTextStyle = {};
                            detailTextStyle['fontWeight'] = 'bolder';
                            detailTextStyle['color'] = '#fff';
                            detail['backgroundColor'] =  'rgba(30,144,255,0.8)';
                            detail['borderWidth'] = 1 ;
                            detail['borderColor'] = '#fff' ;
                            detail['shadowColor'] = '#fff' ;
                            detail['shadowBlur'] =  5;
                            detail['offsetCenter'] = [0 , '50%'] ;
                            detail['textStyle'] = detailTextStyle ;
                            pointer['shadowColor'] = '';
                            pointer['shadowBlur'] = 10;
                            splitLineStyle['width'] = 3;
                            splitLineStyle['color'] = '#fff';
                            splitLineStyle['shadowColor'] = '';
                            splitLineStyle['shadowBlur'] = 10;
                            splitLine['length'] = 25 ;
                            splitLine['lineStyle'] = splitLineStyle ;
                            titleTextStyle['fontWeight'] = 'bolder';
                            titleTextStyle['fontSize'] = 30;
                            titleTextStyle['fontStyle'] = 'italic';
                            titleTextStyle['color'] = '#ffffff';
                            titleTextStyle['shadowColor'] = '#ffffff';
                            titleTextStyle['shadowBlur'] = 10;
                            title['textStyle'] = titleTextStyle ;
                            axisTickLineStyle['color'] = 'auto';
                            axisTickLineStyle['shadowColor'] = '#fff';
                            axisTickLineStyle['shadowBlur'] = 10;
                            axisTick['length'] = 15 ;
                            axisTick['lilneStyle'] = axisTickLineStyle;
                            textStyle['fontWeight'] = 'bolder' ;
                            textStyle['color'] = '#ffffff' ;
                            textStyle['shadowBlur'] = 10;
                            axisLabel['textStyle'] = textStyle ;
                            lineStyle['color'] = [[0.09,'lime'],[0.82, '#1e90ff'],[1, '#ff4500']] ;
                            lineStyle['shadowColor'] = "#ffffff";
                            lineStyle['shadowBlur'] = 10;
                            lineStyle['width'] = 3;
                            axisLine['lineStyle'] = lineStyle;
                            ob['center'] =  [centerWidth+ '% ',  centerHeight + '%']  ;
                            ob['name'] = option.name;
                            ob['type'] = 'gauge' ;
                            ob['min'] = 0 ;
                            ob['max'] = 30 ;
                            ob['splitNumber'] = 10 ;
                            ob['radius'] = '80%' ;
                            ob['axisLine'] = axisLine ;
                            ob['data'] = option ;
                            ob['title'] = title ;
                            ob['axisTick'] = axisTick ;
                            ob['axisLabel'] = axisLabel ;
                            ob['splitLine'] = splitLine ;
                            ob['pointer'] = pointer ;
                            ob['detail'] = detail ;
                            series.push(ob);
                        }
                        g.options.series = series;

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