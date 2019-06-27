{
	type : {
		func : function (data){
 			var base = {
 					$element:null,
 					reportId:null,
 					echart:null,
 					dataDef : null,
 					panelFilterReportId: null,
 					dataSourceId : null,
	 				dataSourceType :null,
	 				reportShowTypeId: null,
  					load:function(params){
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
                                var leftClassNameExtend = "";
 								if(res.bean.leftClassName != null && res.bean.leftClassName.indexOf("fa ") != -1){
 									leftClassNameExtend = 'margin-top:10%;';
 								}
 								if(res.bean.leftTop != null && res.bean.leftTop != undefined){
 									leftClassNameExtend = 'margin-top:'+res.bean.leftTop+'%;';
 								} 
 								
 								if(res.bean.msg != null && res.bean.msg != undefined){
 									res.bean.centerTopText = res.bean.msg;
 									res.bean.centerBottomText = res.bean.msg;
 								}
  								
 								if(res.bean.leftColor == null || res.bean.leftColor == '')
 									res.bean.leftColor = '#67afea';
 								
 								if(res.bean.leftWidth == null || res.bean.leftWidth == ''){
 									res.bean.leftWidth = 20;
 								}
 								var rightWidth = 100 - res.bean.leftWidth;
 								
 								if(res.bean.leftWidth == null || res.bean.leftWidth == ''){
 									res.bean.leftWidth = 20;
 								}
 								var rightWidth = 100 - res.bean.leftWidth;
 								
 								if(res.bean.centerTopFontSize == null || res.bean.centerTopFontSize == ''){
 									res.bean.centerTopFontSize = 24;
 								}
 								
 								if(res.bean.rightBackgroundColor == null || res.bean.rightBackgroundColor == ''){
 									res.bean.rightBackgroundColor = "#fff";
 								}
 								
 							 
 								
	 							var h = '<div class="con icon-text" id="applyinquity" style="width:100%;height:100%;position:relative;">'+
		 									'<span class="icon-wrap bg-blue-light" style="text-align:center;width:'+res.bean.leftWidth+'%;height:100%;background-color:'+res.bean.leftColor+';display:block;">'+
		 										'<i class="'+res.bean.leftClassName+'" style="font-size:45px;color:white;'+leftClassNameExtend+'"></i>'+
		 									'</span>'+
											 '<div class="text-wrap" style="top:0%;right:0px;position:absolute;height:100%;text-align:center;width:'+rightWidth+'%;background-color:'+res.bean.rightBackgroundColor+';display:flex;justify-content:center;align-items:center;">'+
								 				'<div style="display:block;padding-top:5%;font-size:'+res.bean.centerTopFontSize+'px;">'+
		 										'<a style="font-size:'+res.bean.centerTopFontSize+'px;">'+res.bean.centerTopText + '</a>'+
												'<p style="font-size:'+res.bean.centerTopFontSize+'px;">'+res.bean.centerBottomText + '</p>'+
												'</div>'+
		 									'</div>'+
										 '</div>';

										 
 								data.$element.innerHTML = h;
 								
 								
								if(res.bean.callback != undefined && res.bean.callback != null){
 									var str = res.bean.callback ;
									var val = new Function("return " + str)();
									var f = function() {
										val.apply(this,[options]);
									}
									return f();
								}
								
                            },
                            true
                          );  
  			
 					} 
 				}
 				$.extend(base,data);
 				return base;
		}
	}
}