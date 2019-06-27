<template>
  <div>
    <div id="title">
      <h3>商品详情页</h3>
      <input type="text" name="orderTitle" placeholder="商品名称" v-model="byGoodsName">
      <button @click="getDataByGoodsName">查询订单</button>
      <button @click="goSaveDetails">添加订单详细</button>
      <span>总数据条数：{{ total }}</span>
    </div>
    <table>
      <tr>
        <!-- <td>id</td> -->
        <td>orderId</td>
        <td>goodsName</td>
        <td>goodsCount</td>
        <td>goodsMoney</td>
        <td>goodsSubMoney</td>
        <!-- <td>fun12DemoEntity</td> -->
        <td>creator</td>
        <td>creatorName</td>
        <td>createTime</td>
        <td>updator</td>
        <td>updatorName</td>
        <td>updateTime</td>
        <!-- <td>flgDeleted</td> -->
        <td>操作</td>
      </tr>
      <tr v-for="(data ,index) in data1" :key="index">
        <!-- <td>{{data.id}}</td> -->
        <td>{{data.orderId}}</td>
        <td>{{data.goodsName}}</td>
        <td>{{data.goodsCount}}</td>
        <td>{{data.goodsMoney}}</td>
        <td>{{data.goodsSubMoney}}</td>
        <!-- <td>{{data.fun12DemoEntity}}</td> -->
        <td>{{data.creator}}</td>
        <td>{{data.creatorName}}</td>
        <td>{{data.createTime}}</td>
        <td>{{data.updator}}</td>
        <td>{{data.updatorName}}</td>
        <td>{{data.updateTime}}</td>
        <!-- <td>{{data.flgDeleted}}</td> -->
        <td>
          <button @click="getdelete(data.id)">删除</button>
          <button @click="getdataById(data)">修改</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: "",
      getDataUrl:
        "http://localhost:8080/moduledemo/fun12/children/fun12demochildlist/listJSON.do",
      deleteUrl:
        "http://localhost:8080/moduledemo/fun12/children/fun12demochilddelete/delete.do",
      byGoodsName: "",
      data1: [],
      id: ""
    };
  },
  methods: {
    getdelete(deleteId) {
      this.post(
        this.deleteUrl,
        {
          ids: deleteId
        },
        (isScuss, res) => {
          if (isScuss) {
            this.getDataByGoodsName();
          }
        }
      );
    },
    getdataById(data) {
      //跳转到修改页面
      this.$router.push({
        path: "/test/test5",
        query: {
          data: data
        }
      });
    },
    goSaveDetails() {
      //跳转添加订单明细页面
      console.log("向test5五传参： " + this.id);
      this.$router.push({
        path: "/test/test5",
        query: {
          id: this.id
        }
      });
    },
    getDataByGoodsName() {
      this.post(
        this.getDataUrl,
        {
          goodsName: this.byGoodsName,
          orderId: this.id
        },
        (isScuss, res) => {
          console.log("条件查询返回对象集合：" + res.Rows);
          this.total = res.Total;
          this.data1 = res.Rows;
          this.loadingClose();
          
        }
      );
    },
    getdata() {
      //为数据赋值
      console.log("接收test传来的data数据值："+this.$route.query.data1);
      if (this.$route.query.data1 != null) {
        this.data1 = this.$route.query.data1;
      }
      //为id赋值
      console.log("接收test4传来的id值 :" + this.$route.query.id);
      if (this.$route.query.id != null) {
        this.id = this.$route.query.id;
        console.log("id的" + this.id);
      }
    }
  },
  created() {
    this.getdata();
    this.getDataByGoodsName();
  }
};
</script>

<style scoped>
#title button {
  width: 100px;
  height: 30px;
  margin: 0 15px;
  margin-bottom: 10px;
}
h3 {
  text-align: center;
  color: rgb(10, 90, 238);
  font-family: "华文彩云";
}
td {
  border: 1px solid rgb(10, 90, 238);
  text-align: center;
  padding: 10px 10px;
}
#title {
  margin-left: 10px;
}
</style>
