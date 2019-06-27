<template>
  <!-- ID	                    主键ID   	utf8	utf8_bin		-1	0
ORDER_TITLE	            订单标题 	utf8	utf8_bin		0	0
ORDER_NO	            订单编号	utf8	utf8_bin		0	0
SALMON  	            所属销售人员名称	utf8	utf8_bin		0	0
REMARK	    	        备注	utf8	utf8_bin		0	0
CUSTOMER_NAME	    	顾客	utf8	utf8_bin		0	0
CUSTOMER_PHONE_NUM	    顾客电话号码 	utf8	utf8_bin		0	0
CREATOR	    	        创建人ID   	utf8	utf8_bin		0	0
CREATOR_NAME	    	创建人名称 	utf8	utf8_bin		0	0
CREATE_TIME	    	    创建日期 				0	0
UPDATOR 	            最后修改人ID 	utf8	utf8_bin		0	0
UPDATOR_NAME	    	最后修改人名称 	utf8	utf8_bin		0	0
UPDATE_TIME	    	    最后更新日期 				0	0
  FLG_DELETED	    	    逻辑删除标志位（0可用，1不可 用）				0	0-->
  <div>
    <center>
      <div>
        <h3>订单</h3>
        <table>
          <tr>
            <td>订单标题</td>
            <td>
              <input type="text" v-model="orderTitle">
            </td>
          </tr>
          <tr>
            <td>订单编号</td>
            <td>
              <input type="text" v-model="orderNo">
            </td>
          </tr>
          <tr>
            <td>所属销售人员名称</td>
            <td>
              <input type="text" v-model="salmon">
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <input type="text" v-model="remark">
            </td>
          </tr>
          <tr>
            <td>顾客</td>
            <td>
              <input type="text" v-model="customerName">
            </td>
          </tr>
          <tr>
            <td>顾客电话号码</td>
            <td>
              <input type="text" v-model="customerPhoneNum">
            </td>
          </tr>
        </table>
      </div>
    </center>
    <button @click="save" v-show="savs">添加</button>
    <button @click="update" v-show="upds">修改</button>
  </div>
</template>

<script>
import Configjs from "src/config/config.js";
export default {
  name: "Tset6",
  components: {
    Configjs
  },
  data() {
    return {
      savs: true,
      upds: false,
      url: "http://localhost:8080/moduledemo/fun12/fun12demosave/save.do",
      getOrder:
        "http://localhost:8080/moduledemo/fun12/fun12demolist/listJSON.do",
      orderTitle: "",
      orderNo: "",
      salmon: "",
      remark: "",
      customerName: "",
      customerPhoneNum: "",
      id: "",
      data: []
    };
  },
  methods: {
    save() {
      this.post(
        this.url,
        {
          orderTitle: this.orderTitle,
          orderNo: this.orderNo,
          salmon: this.salmon,
          remark: this.remark,
          customerName: this.customerName,
          customerPhoneNum: this.customerPhoneNum
        },
        (isScuss, res) => {
          if (res.hasOk) {
            this.$router.push({ path: "/test/test3" });
            this.loadingClose();
            console.log(this.id);
            if (!this.id) {
              alert("添加成功");
            } else {
              alert("修改成功");
            }
          } else {
            alert("添加失败:::::::" + "\n" + res.message);
            this.loadingClose();
          }
        }
      );
    },
    update() {
      this.post(
        this.url,
        {
          orderTitle: this.orderTitle,
          orderNo: this.orderNo,
          salmon: this.salmon,
          remark: this.remark,
          customerName: this.customerName,
          customerPhoneNum: this.customerPhoneNum,
          id:this.id,
        },
        (isScuss, res) => {
          if (res.hasOk) {
            this.$router.push({ path: "/test/test3" });
            this.loadingClose();
            console.log(this.id);
            if (!this.id) {
              alert("添加成功");
            } else {
              alert("修改成功");
            }
          } else {
            alert("添加失败:::::::" + "\n" + res.message);
            this.loadingClose();
          }
        }
      );
    },
    getData() {
      //如果是修改加载数据
      if (this.$route.query.id != null) {
        this.upds = true;
        this.savs = false;
        this.post(
          this.getOrder,
          {
            id: this.$route.query.id
          },
          (isScuss, res) => {
            console.log(isScuss);
            console.log(res.Rows[0].id);
            // console.log("拿不到吗"+res.Rows[0]);
            // console.log("拿不到吗"+res[0].id);
            if (isScuss) {
              // console.log(res.Rows.orderTitle);
              this.loadingClose();
              this.orderTitle = res.Rows[0].orderTitle;
              this.orderNo = res.Rows[0].orderNo;
              this.salmon = res.Rows[0].salmon;
              this.remark = res.Rows[0].remark;
              this.customerName = res.Rows[0].customerName;
              this.customerPhoneNum = res.Rows[0].customerPhoneNum;
              this.id = res.Rows[0].id;
            } else {
              alert("失败:::::::" + "\n" + res.message);
              this.loadingClose();
            }
          }
        );
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
h3 {
  text-align: center;
  color: red;
  font-family: "华文彩云";
}
td {
  border: 1px solid red;
  text-align: center;
  padding: 10px 30px;
}
</style>
