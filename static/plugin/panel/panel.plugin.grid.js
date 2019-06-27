{
	type : {
		func : function (data){
			var base = {
					$element:null,
 	 				reportId:null,
 	 				echart:null,
 	 				dataDef : null,
 	 				panelFilterReportId: null,
 	 				options:null,
 	 				dataSourceId : null,
 		 			dataSourceType :null,
 		 			reportShowTypeId: null,
					//生成列表
					genColumns : function(data, type){
				  	 	if(data){
				  		   var columns = new Array();
					       columns.push({field: 'number',title: '序号', align:"center", formatter: function (value, row, index) {return (index+1);}});
				       
				      	   for(var key in data){
                                 if(type === 1){
                                    if(!data[key].isHidden){
				      			  	    columns.push({title:data[key].display,field:data[key].name, type:data[key].type,align:"center" });
				      		        }
                                 }else{
                                    columns.push({title:data[key].title,field:data[key].field,align:"center" });
                                 }
				      	    }
				      	 	return columns;
				  		}
				  	 	return null;
				    },
					initTable: function($obj,columns,datas){
						var chartOptions = {
				            striped: true,                      //是否显示行间隔色
				       		columns:  columns,
 						}
						if(datas != null && datas != undefined)
							$.extend(chartOptions,{data:datas});
						$obj.bootstrapTable(chartOptions);
					},
					load: function(params){
 		 				var g = this;
						if(g.dataSourceType == 'report'){
                              Vue.prototype.post(
                                Vue.prototype.INTERFACE.gridReport+g.dataSourceId,
                                {},
                                (isSuccess, res) => {
                                    data.$element.innerHTML='<div class="common-table tableScroll"><table class="table table-hover"></table></div>';
                                    var $table = $(data.$element).find(".table");
                                    var columns = g.genColumns(res.moduleFields,1);
                                    var url = Vue.prototype.BASEURL+res.listJSONURL+'?csId='+g.dataSourceId;
                                    Vue.prototype.post(
                                        url,
                                        {
                                            usePage: false,
			                                searchParam: params
                                        },
                                        (isSuccess, subRes) => {
                                            g.initTable($table,columns,subRes.Rows);
                                        },
                                        true
                                    );
                                    
                                },
                                true
                              );  
						}else if(g.dataSourceType == 'filter'){ 
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
                                    data.$element.innerHTML='<div class="common-table tableScroll"><table class="table table-hover"></table></div>';
                                    var $table = $(data.$element).find(".table");
                                    var columns = g.genColumns(res.bean.columns,2);
                                    var datas = res.bean.datas;
                                    g.initTable($table,columns,datas);
                                },
                                true
                              );  
						}
						
					}
				}
				$.extend(base,data);
				return base;
			}
	}
}