<template>
  <div>
    <div id="title">
      <h3>订单总览页</h3>
      <input type="text" name="orderTitle" placeholder="订单标题" v-model="orderTitle">
      <button @click="goOrderByTitle">查询订单</button>
      <button>
        <router-link to="/test/test6">添加</router-link>
      </button>
    </div>
    <div>
      <table>
        <tr>
          <!-- <td>id</td> -->
          <td>orderNo</td>
          <td>orderTitle</td>
          <td>remark</td>
          <td>salmon</td>
          <td>customerName</td>
          <td>customerPhoneNum</td>
          <td>creator</td>
          <td>creatorName</td>
          <td>createTime</td>
          <td>updator</td>
          <td>updatorName</td>
          <td>updateTime</td>
          <!-- <td>flgDeleted</td> -->
          <td>操作</td>
        </tr>
        <tr v-for="(data,index) in orderData" :key="index">
          <!-- <td>{{data.id}}</td> -->
          <td>{{data.orderTitle}}</td>
          <td>{{data.remark}}</td>
          <td>{{data.salmon}}</td>
          <td>{{data.customerName}}</td>
          <td>{{data.customerPhoneNum}}</td>
          <td>{{data.orderNo}}</td>
          <td>{{data.creator}}</td>
          <td>{{data.creatorName}}</td>
          <td>{{data.createTime}}</td>
          <td>{{data.updator}}</td>
          <td>{{data.updatorName}}</td>
          <td>{{data.updateTime}}</td>
          <!-- <td>{{data.flgDeleted}}</td> -->
          <td>
            <button @click="goOrderDetails(index,data.id)">详细</button>
            <button @click="getdelete(data.id)">删除</button>
            <button @click="getdataById(data.id)">修改</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Configjs from "src/config/config.js";
export default {
  name: "Tset3",
  data() {
    return {
      orderTitle: "",
      deteleUrl:
        "http://localhost:8080/moduledemo/fun12/fun12demolist/delete.do",
      getOrder:
        "http://localhost:8080/moduledemo/fun12/fun12demolist/listJSON.do",
      orderData: []
    };
  },
  components: {
    Configjs
  },
  methods: {
    getdata() {
      this.post(this.getOrder, {}, (isScuss, res) => {
        this.orderData = res.Rows;
        console.log(this.orderData);
        this.loadingClose();
      });
    },
    goOrderByTitle() {
      console.log(this.orderTitle);
      this.post(
        this.getOrder,
        {
          orderTitle: this.orderTitle
        },
        (isScuss, res) => {
          this.orderData = res.Rows;
          console.log(this.orderData);
          this.loadingClose();
        }
      );
    },
    goOrderDetails(num, id) {
      //详情页跳转
      console.log("向test4传值ID：" + id);
      console.log(id);
      console.log(this.orderData[num].fun12DemoChildForm);
      this.$router.push({
        path: "/test/test4",
        query: {
          data1: this.orderData[num].fun12DemoChildForm,
          id: id
        }
      });
    },
    getdelete(id) {
      //删除数据
    },
    getdataById(id) {
      //修改数据
      this.$router.push({
        path: "/test/test6",
        query: {
          id: id
        }
      });
    }
  },
  created() {
    this.getdata();
  }
};
</script>

<style scoped>
td {
  border: 1px solid red;
  text-align: center;
  padding: 10px 20px;
}

#title button {
  width: 100px;
  height: 30px;
  margin: 0 15px;
  margin-bottom: 10px;
}
#but1 {
  margin: 0 15px;
}
h3 {
  text-align: center;
  color: red;
  font-family: "华文彩云";
}
#title {
  margin-left: 10px;
}
</style>
