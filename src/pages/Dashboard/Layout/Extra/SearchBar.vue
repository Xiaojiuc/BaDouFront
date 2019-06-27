<template>
  <div class="searchBar">
      <div class="filter" v-if="filterBlock">
        <p>我的筛选:</p>
        <p class="fiterName" v-for="(list,index) in valueProject" :key="index">
            <span>{{list}}</span>
            <i class="fa fa-share" @click="share_dialog_Visible = true"></i>
            <i class="el-icon-error" @click="delectFilter(index)"></i>
          </p>
        <p class="alert-btn" @click="filterSave()">保存过滤器</p>
      </div>
      <div class="search-box">

        <!-- 日期时间选择器 -->
        <div class="search-value" v-if="timeBlock">
          <span>{{date_Selector_name}}:</span>
          <el-popover
            width="400"
            trigger="click">
             <el-radio v-model="radio" label="1">
               <el-date-picker
                v-model="dateVal"
                :type="dateType"
                placeholder="选择日期">
              </el-date-picker>
              至
              <el-date-picker
                v-model="dateVal"
                :type="dateType"
                placeholder="选择日期">
              </el-date-picker>
            </el-radio>
            <el-radio v-model="radio" label="2">
               在过去的
               <el-input type="text" />
               <el-dropdown>
                <span class="el-dropdown-link">
                  {{dateSelect}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="selectDate(item)" v-for="(item, index) in dateOption" :key="index">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              之内
            </el-radio>
            <el-radio v-model="radio" label="3">
               超过
               <el-input type="text" />
               <el-dropdown>
                <span class="el-dropdown-link">
                  {{dateSelect}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="selectDate(item)" v-for="(item, index) in dateOption" :key="index">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              之前
            </el-radio>
            <el-button type="primary">搜索</el-button>
            <el-button slot="reference" plain>日期时间选择器</el-button>
          </el-popover>
        </div>

        <div class="selector_name" v-if="datePicker">{{this.ym_Selector_name}}:</div>
        <!-- 年月选择器 -->
        <div class="search-value" v-if="datePicker">
          <el-date-picker
            v-model="pickerVal"
            :type="pickerType"
            placeholder="选择日期">
          </el-date-picker>
        </div>

        <div class="search-value" v-for="(item, index) in inBlock" :key="index">
          <label>{{labelData[item].name}}:</label>
          <input :placeholder="labelData[item].value" v-model="val" />
        </div>

        <!-- 下拉多选框 -->
        <div class="search-value" v-for="(item,index) in multipleArray" :key="index">
          <span>{{labelData[item].name}}:</span>
          <el-popover
            placement="bottom"
            width="150"
            trigger="click">
            <el-checkbox v-for="(optionVal, index2) in termData[multipleItem[index]].data" :key="index2" @change="checked=>getOption(checked,optionVal.text,item)">{{optionVal.text}}</el-checkbox>

            <el-button slot="reference" class="text-style" plain>{{labelData[item].valueText.toString()}}</el-button>
          </el-popover>
        </div>

        <!-- 下拉单选框 -->
        <div class="search-value" v-for="(item,index) in radioArray" :key="index">
          <span>{{labelData[item].name}}:</span>
          <el-dropdown>
            <el-button type="primary">
              {{labelData[item].valueText}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="selectDrop(listVal.text,item)" v-for="(listVal, index2) in termData[radioItem[index]].data" :key="index2">{{listVal.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 更多条件选择框 -->
        <div class="search-value">
          <el-popover
            placement="bottom"
            width="150"
            trigger="click">
            <el-checkbox v-for="(item,index) in moreSelect" :key="index"  v-model="checkedList[index]">{{labelData[item].name}}</el-checkbox>
            <el-button slot="reference" plain>更多</el-button>
          </el-popover>
        </div>

        <el-button type="primary">搜索</el-button>
        <el-button >重置</el-button>
      </div>

     
       <div class="search-box" v-if="extraSearch">

        <!-- 日期时间选择器 -->
        <div class="search-value" v-if="more_time">
          <span>{{more_date_Selector_name}}:</span>
          <el-popover
            width="400"
            trigger="click">
             <el-radio v-model="radio" label="1">
               <el-date-picker
                v-model="dateVal"
                type="more_dateType"
                placeholder="选择日期">
              </el-date-picker>
              至
              <el-date-picker
                v-model="dateVal"
                type="more_dateType"
                placeholder="选择日期">
              </el-date-picker>
            </el-radio>
            <el-radio v-model="radio" label="2">
               在过去的
               <el-input type="text" />
               <el-dropdown>
                <span class="el-dropdown-link">
                  {{dateSelect}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="selectDate(item)" v-for="(item, index) in dateOption" :key="index">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              之内
            </el-radio>
            <el-radio v-model="radio" label="3">
               超过
               <el-input type="text" />
               <el-dropdown>
                <span class="el-dropdown-link">
                  {{dateSelect}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="selectDate(item)" v-for="(item, index) in dateOption" :key="index">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              之前
            </el-radio>
            <el-button type="primary">搜索</el-button>
            <el-button slot="reference" plain>日期时间选择器</el-button>
          </el-popover>
        </div>


        <div class="selector_name" v-if="more_datePicker">{{more_ym_Selector_name}}:</div>
        <!-- 年月选择器 -->
        <div class="search-value" v-if="more_datePicker">
          <el-date-picker
            v-model="more_pickerVal"
            :type="more_pickerType"
            placeholder="选择日期">
          </el-date-picker>
        </div>

        <!-- 输入框 -->
        <div class="search-value" v-for="(item, index) in more_inBlock" :key="index">
          <label>{{labelData[item].name}}:</label>
          <input v-model="labelData[item].value" />
        </div>



        <!-- 下拉多选框 -->
        <div class="search-value" v-for="(item,index) in more_multiple" :key="index">
          <span>{{labelData[item].name}}:</span>
          <el-popover
            placement="bottom"
            width="150"
            trigger="click">
            <el-checkbox v-for="(listVal, index2) in termData[more_multipleItem[index]].data" :key="index2" @change="checked=>getOption(checked,listVal.text,item)">{{listVal.text}}</el-checkbox>
            <el-button slot="reference" plain>{{labelData[item].valueText.toString()}}</el-button>
          </el-popover>
        </div>  

        <!-- 下拉单选框 -->
        <div class="search-value" v-for="(item,index) in more_radio" :key="index">
          <span>{{labelData[item].name}}:</span>
          <el-dropdown>
            <el-button type="primary">
              {{labelData[item].valueText}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="selectDrop(listVal.text,item)" v-for="(listVal, index2) in termData[more_radioItem[index]].data" :key="index">{{listVal.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- 分享过滤器 -->
      <el-dialog title="分享过滤器" :visible.sync="share_dialog_Visible" width="30%" :before-close="handleClose">
        <div class="dialog-title">
          <span class="">请选择分享的过滤器</span>
          <span class="dialog-span">全部过滤器</span>
        </div>
        <div class="dialog-content">
          <div class="dialog-item" v-bind:class="{ selected:index == changeStyle[index].isChange}" v-for="(item,index) in valueProject" :key="index" @click="selectFilter(index)">
            <i class="fa fa-filter"></i>
            {{item}}
          </div>
        </div>
        <div class="dialog-title">
          <span class="">请选择分享的用户</span>
          <span class="dialog-span" @click="selectAll()">{{selectLabel}}</span>
          <span class="dialog-span">全部用户</span>
        </div>
        <div class="dialog-content">
          <div class="dialog-user" v-for="(item,index) in userList" :key="index" @click="selectUser(index)">
            <img src="http://cloud.badousoft.com/init/img/choose.png" v-if="item.isSelect">
            <i class="fa fa-user"></i>
            {{item.name}}
          </div>
        </div>
        <span slot="footer" class="dialog-footer foot-border">
          <el-button @click="share_dialog_Visible = false">取 消</el-button>
          <el-button type="primary" @click="share_dialog_Visible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 过滤器操作选择 -->
      <el-dialog title="保存过滤器" :visible.sync="filter_dialog_Visible" width="30%" :before-close="handleClose">
        <div class="dialog-text">
          <span>亲，您是否要更新过滤器或者另外再创建一个过滤器</span>
        </div>
        <span slot="footer" class="dialog-footer foot-border">
          <el-button type="primary" @click="filter_dialog_Visible = false">保存</el-button>
          <el-button type="primary" @click="filter_dialog_Visible = false,addFilter()">另存</el-button>
          <el-button  @click="filter_dialog_Visible = false">取消</el-button>
        </span>
      </el-dialog>

  </div>
</template>
<script>
  import $ from 'jquery'
  import { Dialog,Dropdown,DropdownMenu,DropdownItem,Popover,Checkbox,DatePicker,Radio } from 'element-ui'
  export default {
    components: {
      [Dialog.name]:Dialog,
      [Dropdown.name]:Dropdown,
      [DropdownMenu.name]:DropdownMenu,
      [DropdownItem.name]:DropdownItem,
      [Popover.name]:Popover,
      [Checkbox.name]:Checkbox,
      [DatePicker.name]:DatePicker,
      [Radio.name]:Radio
    },

    data () {
      return {
        val:'', //input标签变量控制
        valueProject:[], //过滤器删减控制数组
        share_dialog_Visible: false, //分享过滤器对话框显示控制
        filter_dialog_Visible:false, //过滤器添加弹框显示控制
        changeStyle:[], //选择/取消过滤器动态样式控制
        userList:[ //用户模拟数组
          {name:"测试人员",isSelect:1},
          {name:"测试人员",isSelect:1},
          {name:"测试人员",isSelect:1},
          {name:"测试人员",isSelect:1},
          {name:"测试人员",isSelect:1},
        ],
        selectLabel:'全选', //全选按钮文本控制
        dateVal:'', //日期选择值
        radio:"1", //单选选择值
        dateOption:['天','周','个月','年'], //年月周日选项数组
        dateSelect:'', //年月周日下拉菜单选择值
        extraSearch:false, //更多搜索条件块显示控制
        timeBlock:false, //日期时间选择器显示控制
        checkedList:[], //监听更多条件选中值
        labelData:[{"valueText":"全部","name":"标签类型","selectType":0,"id":"tag_type","isExtended":true},{"valueText":"全部","name":"所属校区","selectType":9,"id":"campus","isExtended":true},{"valueText":"111","name":"所属校区","selectType":9,"id":"campus","isExtended":false},{"name":"标签名称","selectType":1,"id":"tag_name","isExtended":false,"value":""},{"valueText":"全部","isExtended":false,"type":0,"formate":"yyyy-MM-dd","name":"创建时间","selectType":5,"id":"createTime","value":""},{"formate":"yyyy-MM","valueText":"全部","name":"创建人","selectType":10,"id":"creatorName","isExtended":false,"value":"2017-9"},{"name":"标签名称","selectType":1,"id":"tag_name","isExtended":false,"value":""}],

        termData:[{"data":[{"id":"1","text":"学生标签"},{"id":"2","text":"教师标签"},{"id":"3","text":"班级标签"}],"name":"标签类型","id":"tag_type"},{"data":[{"id":"1","text":"学生标签"},{"id":"2","text":"教师标签"},{"id":"3","text":"班级标签"}],"name":"所属校区","id":"campus"},{"name":"标签名称","id":"tag_name"},{"name":"创建时间","id":"createTime"},{"name":"创建人","id":"creatorName"}],
        filterBlock:true, //过滤器显示控制
        inBlock:[], //输入框记忆数组
        dateType:'date', //日期时间选择器类型
        datePicker:false, //年月选择器显示控制
        pickerType:'date', //年月选择器类型
        pickerVal:'', //年月选择器选中值
        multipleArray:[], //下拉多选记忆数组
        radioArray:[], //下拉单选框记忆数组
        multipleItem:[], //下拉多选框选项
        radioItem:[], //下拉单选框选项
        moreSelect:[], //更多搜索条件记忆数组
        more_multiple:[], //更多条件:下拉多选框记忆数组
        more_multipleItem:[], //更多条件:下拉多选框选项
        more_inBlock:[], //更多条件:输入框记忆数组
        more_time:false, //更多条件:日期时间选择器显示控制
        more_dateType:'date', //更多条件:日期时间选择器格式
        more_radio:[], //更多条件:下拉单选框记忆数组
        more_radioItem:[], //更多条件:下拉单选框选项
        more_datePicker:false, //更多条件:年月选择器显示控制
        more_pickerVal:'', //更多条件:年月选择器值
        more_pickerType:'date', //更多条件:年月选择器格式
        date_Selector_name:'', //日期时间选择器名称
        ym_Selector_name:'', //年月选择器名称
        more_date_Selector_name:'', //更多条件:日期时间选择器名称
        more_ym_Selector_name:'', //更多条件:年月选择器名称名称
      }
    },
    methods: {
      filterSave:function(){ //打开过滤器添加弹框
        console.log(this.valueProject)
        if(this.valueProject.length){
          this.filter_dialog_Visible=true;
        }else{
          this.addFilter()
        }
      },
      addFilter:function(){ //添加过滤器弹框
        this.$prompt('', '保存过滤器', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder:'请输入过滤器名称...',
          }).then(({ value }) => {
            if(value!=null){
              this.valueProject.push(value)
              this.changeStyle.push({isChange:""})
              this.changeStyle[this.changeStyle.length-1].isChange=-1

              this.$message({
                type: 'success',
                message: '新增过滤器名称为: ' + value,
              });
            }else{
              this.$message({
                type: 'info',
                message: '此次输入的过滤器名为空!'
              });
            }
            
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          });
      },
      delectFilter:function(index){ //删除过滤器
        this.valueProject.splice(index,1)
      },
      selectFilter:function(index){  //选择分享过滤器
        if(this.changeStyle[index].isChange===index){
          this.$set(this.changeStyle[index],"isChange" ,-1)
        }else{
          this.$set(this.changeStyle[index],"isChange" ,index)
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      selectUser:function(index){ //选择分享用户
        if(this.userList[index].isSelect){
          this.userList[index].isSelect=0
        }else{
          this.userList[index].isSelect=1
        }
      },
      selectAll:function(){ //分享用户全选
        if(this.selectLabel==="全选"){
          this.selectLabel="取消全选"
          for(var i=0;i<this.userList.length;i++){
            this.userList[i].isSelect=1
          }
        }else{
          this.selectLabel="全选"
          for(var i=0;i<this.userList.length;i++){
            this.userList[i].isSelect=0
          }
        }
      },
      selectDrop:function(data,index){ //下拉菜单选择
        this.labelData[index].valueText=data
      },
      selectDate:function(date){ //年月周日选择
        this.dateSelect=date
      },
      traversing:function(dataList){
        for(var i=0;i<dataList.length;i++){
          if(dataList[i]){
            return true
          }
        }
        return false
      },
      getOption(checked,value,item){ /*checked 多选框变化后的值 为boolean类型 value 选中的值 item 选中的值数组*/
        if(checked){ //checked 为true时添加
          if(this.labelData[item].valueText[0]==="全部"){ //有选中时,取消默认全部
            this.labelData[item].valueText=[]
          }
          var isCheck=this.findDiffer(this.labelData[item].valueText,value)
          if(!isCheck){ //数组中不存在当前选中选项,添加
            var subscript=this.labelData[item].valueText.length
            this.labelData[item].valueText[subscript]=value
          }
        }else{ //checked 为false时删除
          var isCheck=this.findDiffer(this.labelData[item].valueText,value)
          if(isCheck>=0){ //当数组存在当前要取消的选项,删除
            console.log(isCheck)
            this.labelData[item].valueText.splice(isCheck,1)
            
            console.log(this.labelData[item].valueText)
          }
        }
        if(this.labelData[item].valueText.length===0){ //没有选中选项时,默认为全部
          this.labelData[item].valueText[0]="全部"
        }
        this.$forceUpdate()
      },
      /*查找是否存在存在则返回下标值 否则返回false*/
      findDiffer(dataList,val){ /*dataList 需要查找的数组 val 选中的选项值*/
        for(var i=0;i<dataList.length;i++){
          if(dataList[i]===val){
            return i
          }
        }
        return false
      }
    },
    watch:{
      checkedList(val,oldval){ //对更多条件选择框中的值进行实时监听
        console.log(val)
        var isShow=this.traversing(val)
        if(isShow){
          this.extraSearch=true
        }else{
          this.extraSearch=false
        }

        var j=-1; //输入框计数
        var n=-1; //下拉多选框计数
        var m=-1; //下拉单选框计数

        for(var i=0;i<val.length;i++){ //循环查找被选中的搜索条件
          if(val[i]){ //被选中的组件
            switch(this.labelData[this.moreSelect[i]].selectType){
              case 0: //下拉多选
                n++
                /*记住当前组件在数据中的下标*/
                this.more_multiple[n]=this.moreSelect[i]

                /*查找当前下拉多选框对应的选项*/
                for(var j=0;j<this.termData.length;j++){
                  if(this.labelData[this.moreSelect[i]].id===this.termData[j].id){
                    this.more_multipleItem[n]=j
                  }
                }
                /*下拉多选框的显示,原为字符串类型,改为数组*/
                this.labelData[n].valueText=['全部']
                break;
              case 1: //普通的输入框
                j++
                // 记住当前组件在数据中的下标
                this.more_inBlock[j]=this.moreSelect[i]
                break;
              case 5: //日期时间选择
                this.more_time=true; //控制将选择器显示
                this.more_date_Selector_name=this.labelData[item].name //选择器对应的名称
                switch(this.labelData[i].formate){ //根据数据定义选择器的格式
                  case "yyyy-MM-dd":
                    this.more_dateType="date"
                    break;
                  case "yyyy-MM":
                    this.more_dateType="month"
                    break;
                  case "yyyy":
                    this.more_dateType="year"
                    break;
                }
                break;
              case 9: //下拉单选
                m++
                this.more_radio[m]=this.moreSelect[i] //记住当前组件在数据中的下标
                /*查找当前下拉单选框对应的选项*/
                for(var j=0;j<this.termData.length;j++){
                  if(this.labelData[this.moreSelect[i]].id===this.termData[j].id){
                    this.more_radioItem[m]=j
                  }
                }
                break;
              case 10: //年月选择
                this.more_datePicker=true //控制将选择器显示

                this.more_pickerVal=this.labelData[i].value //选择器默认的值
                switch(this.labelData[i].formate){ //根据数据定义选择器的格式
                  case "yyyy-MM-dd":
                    this.more_pickerType="date"
                    break;
                  case "yyyy-MM":
                    this.more_pickerType="month"
                    break;
                  case "yyyy":
                    this.more_pickerType="year"
                    break;
                }
                break;
            }
          }else{ //未被选中或被取消的组件,清空所有数据
            switch(this.labelData[this.moreSelect[i]].selectType){
              case 0: //下拉多选
                this.more_multiple=[]
                break;
              case 1: //普通的输入框
                this.more_inBlock=[]
                break;
              case 5: //日期时间选择
                this.more_time=false;
                this.more_dateType="date"
                break;
              case 9: //下拉单选
                this.more_radio=[]
                break;
              case 10: //年月选择
                this.more_datePicker=false
                this.more_pickerVal=''
                this.more_pickerType="date"
                break;
            }
          }
        }
      }
    },
    created() {
      this.dateSelect=this.dateOption[0]

      console.log(this.labelData.length)
      var j=-1; //输入框计数
      var n=-1; //下拉多选框计数
      var m=-1; //下拉单选框计数
      var o=-1; //更多搜索条件计数

      //遍历数据显示对应的搜索组件
      for(var i=0;i<this.labelData.length;i++){
        if(this.labelData[i].isExtended===false){ //判断是否在更多条件选择框中
          switch(this.labelData[i].selectType){
            case 0: //下拉多选
              n++
              // 记住当前组件在数据中的下标
              this.multipleArray[n]=i

              /*查找当前下拉多选框对应的选项*/
              for(var q=0;q<this.termData.length;q++){
                if(this.labelData[i].id===this.termData[q].id){
                  this.multipleItem[n]=q
                }
              }
              this.labelData[n].valueText=['全部']

              break;
            case 1: //普通的输入框
              j++
              // 记住当前组件在数据中的下标
              this.inBlock[j]=i
              break;
            case 5: //日期时间选择
              this.timeBlock=true; //控制将选择器显示
              this.date_Selector_name=this.labelData[i].name ////选择器对应的名称
              switch(this.labelData[i].formate){ //根据数据定义选择器的格式
                case "yyyy-MM-dd":
                  this.dateType="date"
                  break;
                case "yyyy-MM":
                  this.dateType="month"
                  break;
                case "yyyy":
                  this.dateType="year"
                  break;
              }
              break;
            case 9:  //下拉单选
              m++
              // 记住当前组件在数据中的下标
              this.radioArray[m]=i
              /*查找当前下拉多选框对应的选项*/
              for(var q=0;q<this.termData.length;q++){
                if(this.labelData[i].id===this.termData[q].id){
                  this.radioItem[m]=q
                }
              }
              break;
            case 10: //年月选择
              this.datePicker=true //控制将选择器显示
              this.ym_Selector_name=this.labelData[i].name //选择器对应的名称
              this.pickerVal=this.labelData[i].value //选择器默认的值
              switch(this.labelData[i].formate){ //根据数据定义选择器的格式
                case "yyyy-MM-dd":
                  this.pickerType="date"
                  break;
                case "yyyy-MM":
                  this.pickerType="month"
                  break;
                case "yyyy":
                  this.pickerType="year"
                  break;
              }
              break;
          }
        }else{ //判断在更多条件选择框中成立
          o++
          this.moreSelect[o]=i
        }
      }
    }
  }
</script>
<style>
  .searchBar{
    width: 100%;
    height: auto;
    background-color: white;
    margin:1% 0;
    padding: 0 0 1% 0;
    border:1px solid rgba(0, 0, 0, 0.125);
  }
  .filter{
    padding-left: 1%;
    background-color: #fdfdfd
  }
  .filter p{
    background-color: #fdfdfd;
    margin:0;
    padding: 10px 0 10px 0;
    display: inline-block;
  }
  .filterName{
    color:#5d5d5d;
  }
  .alert-btn{
    color:#007FBE;
    margin:0 5px;
  }
  .alert-btn:hover{
    color:#f36100;
  }
  .searchBar p span:hover{
    color:#f36100; 
  }
  .fiterName i{
    color:#bbb;
  }
  .fiterName i:hover{
    color:#333;
  }
  .search-box{
    display: block;
    width: 100%;
    height: auto;
    margin-top: 3px;
  }
  .search-value{
    width: auto;
    height: auto;
    margin-left: 1%;
    display: inline-block;
  }
  .el-picker-panel__content .el-month-table td .cell{
    font-size: 12px;
  }
  .search-value input{
    width: 200px;
    height: 35px;
    border:1px solid #DCE0E9;
    border-radius: 5px;
    padding-left: 5px;
    padding-top: 5px;
  }
  .search-box button{
    height: 35px;
    margin-left: 1%;
    outline: none;
  }
  .dialog-title{
    border-bottom: 1px solid #D8D8D8;
    margin:0 20px;
    padding:10px 0;
  }
  .dialog-span{
    float: right;
    margin-left: 10px;
    color:#9191e8;
  }
  .dialog-content{
    display: block;
    padding: 0 10px;
    margin:0 20px;
  }
  .dialog-item{
    display: inline-block;
    background-color: #52b3df;
    color:white;
    margin: 5px 5px;
    text-align: center;
    width: 100px;
    height: 35px;
    border-radius: 50px;
    overflow:hidden;
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 7px 10px 0px 10px;
  }
  .dialog-item i{
    color:white;
  }
  .dialog-item i:hover{
    color:unset;
  }
  .selected{
    background-color: #c2e2f2;
    color:#e2f0f7;
  }
  .el-dialog__body{
    padding:0;
  }
  .dialog-user{
    display: inline-block;
    width: 70px;
    height: 80px;
    margin: 3px 10px;
    padding-top: 5px;
    text-align: center;
    color:#333;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
  .dialog-user i{
    display: block;
    font-size: 30px;
    margin:0 auto;
    color:#333;
  }
  .dialog-user img{
    position: absolute;
    font-size: 18px;
    color: #49b1e0;
    left:0;
  }
  .el-dialog__footer{
    border-top: 1px solid #e7e4f0
  }
  .dialog-text{
    padding: 20px 20px 10px 20px;
  }
  .search-value el-dropdown{
    height: 35px;
    padding-top: 6px;
    font-size: 16px;
    outline: none;
  }
  .el-popover .el-date-editor.el-input{
    width: 40% !important
  }
  .el-popover .el-input{
    width: 20%;
  }
  .el-checkbox{
    display: block;
  }
  .text-style{
    width: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .search-value span{
    display: inline-block;
  }
  .selector_name{
    display: inline-block;
    margin-right: -15px;
    margin-left: 10px;
  }
</style>
