<template>
  <div>
    <center>
      <div>
        <h3>订单详情页</h3>
        <table>
          <tr>
            <td>商品名称</td>
            <td>
              <input type="text" v-model="goodsName">
            </td>
          </tr>
          <tr>
            <td>商品数量</td>
            <td>
              <input type="text" v-model="goodsCount">
            </td>
          </tr>
          <tr>
            <td>商品单价</td>
            <td>
              <input type="text" v-model="goodsMoney">
            </td>
          </tr>
          <tr>
            <td>商品总价</td>
            <td>
              <input type="text" v-model="goodsSubMoney">
            </td>
          </tr>
        </table>
      </div>
    </center>
    <button @click="save" v-show="sav" v-text="butt"></button>
    <button v-show="upds" @click="upd" v-text="butt"></button>
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
      sav: false,
      upds: false,
      butt: "",
      url:
        "http://localhost:8080/moduledemo/fun12/children/fun12demochildsave/save.do",
      data: [],
      id: "",
      orderId: "",
      goodsName: "",
      goodsCount: "",
      goodsMoney: "",
      goodsSubMoney: ""
    };
  },
  methods: {
    getId() {
      console.log("页面的显示");
      if (this.$route.query.id != null) {
        this.orderId = this.$route.query.id;
        console.log("到达test5并获取ID:" + this.orderId);
        this.butt = "添加";
        this.sav = true;
      }

      console.log("test5需要修改的数据" + this.$route.query.data);
      console.log("test5需要修改的数据子表ID" + this.$route.query.data.id);
      console.log("test5需要修改的数据父表ID" + this.$route.query.data.orderId);
      if (this.$route.query.data != null) {
        this.data = this.$route.query.data;
        //获取test3传来的数据
        this.id = this.data.id;
        this.orderId = this.data.orderId;
        this.goodsName = this.data.goodsName;
        this.goodsCount = this.data.goodsCount;
        this.goodsMoney = this.data.goodsMoney;
        this.goodsSubMoney = this.data.goodsSubMoney;
        this.butt = "修改";
        this.upds = true;
      }
      console.log(this.butt);
    },
    save() {
      this.post(
        this.url,
        {
          goodsName: this.goodsName,
          goodsCount: this.goodsCount,
          goodsMoney: this.goodsMoney,
          goodsSubMoney: this.goodsSubMoney,
          orderId: this.orderId
        },
        (isScuss, res) => {
          if (res.hasOk) {
            //关闭幕布
            this.loadingClose();
            console.log(this.id);
            if (!this.id) {
              alert(res.message);
              this.$router.push({
                /*跳回到订单主页面*/
                path: "/test/test3",
                query: {}
              });
            } else {
              alert(res.message);
            }
          } else {
            alert("添加失败:::::::" + "\n" + res.message);
            this.loadingClose();
          }
        }
      );
    },
    upd() {
      this.post(
        this.url,
        {
          goodsName: this.goodsName,
          goodsCount: this.goodsCount,
          goodsMoney: this.goodsMoney,
          goodsSubMoney: this.goodsSubMoney,
          id: this.id
        },
        (isScuss, res) => {
          this.loadingClose();
          alert(res.message);
          this.$router.push({
            /*跳回到订单主页面*/
            path: "/test/test3",
            query: {}
          });
        }
      );
    }
  },
  created() {
    this.getId();
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
