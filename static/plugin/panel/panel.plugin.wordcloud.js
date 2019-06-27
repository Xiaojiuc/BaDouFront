{
	type : {
		func : function (data){
 			//=============================定义图表支持echarts/highcharts基本属性start===========================
  			var chartOptions = {
					tooltip : {},  
			        series : [ {  
			            type : 'wordCloud',  
			            shape:'smooth',  
			            gridSize : 2,  
			            sizeRange : [ 50, 100 ],  
			            rotationRange : [ 46, 80 ],  
			            textStyle : {  
			                normal : {  
			                    color : function() {  
			                        return 'rgb('  
			                                + [ Math.round(Math.random() * 160),  
			                                        Math.round(Math.random() * 160),  
			                                        Math.round(Math.random() * 160) ]  
			                                        .join(',') + ')';  
			                    }  
			                },  
			                emphasis : {  
			                    shadowBlur : 10,  
			                    shadowColor : '#333'  
			                }  
			            },  
			            data: []
			        } ]  
			};
 			//=============================定义图表基本属性end===========================
 			
             if(data.chartOptions)
                $.extend(chartOptions, data.chartOptions);
            /*增加功能 优先级最高 重新定义报表设置*/
            evalJs(chartOptions,false);
  			
 			//最终返回的对象 start
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
 					} ,
 					renderChartsData: function(data) {
                        var g = this;
  						if(data){
                             g.options.series[0].data = data;
                             evalJs(g.options,true);
                             this.echart.setOption(g.options,true);
 						 }
 					}
 				}
 				$.extend(base,data);
 				return base;
			//最终返回的对象 end
		}
	}
}