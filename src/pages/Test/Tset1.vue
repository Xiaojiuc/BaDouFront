<template>
  <div>
    
    <input type="text" name="orderTitle" placeholder="订单标题" v-model="selDrderTitle">
    <button id="but1" @click="getdataTitle">查询数据</button>
    <button>
      <router-link to="/test/test2">添加</router-link>
    </button>
    <button>
      <router-link to="/test/test3">订单页面</router-link>
    </button>
    <button>
      <router-link to="/test/test7">上传头皮发麻</router-link>
    </button>
    <table id="lists" border="1px">
      <tr>
        <td>orderTitle</td>
        <td>remark</td>
        <td>salmon</td>
        <td>creator</td>
        <td>creatorName</td>
        <td>createTime</td>
        <td>updator</td>
        <td>updatorName</td>
        <td>updateTime</td>
        <td>flgDeleted</td>
        <td>操作</td>
      </tr>
      <tr v-for="(data,index) in data" :key="index">
        <td>{{data.orderTitle}}</td>
        <td>{{data.remark}}</td>
        <td>{{data.salmon}}</td>
        <td>{{data.creator}}</td>
        <td>{{data.creatorName}}</td>
        <td>{{data.createTime}}</td>
        <td>{{data.updator}}</td>
        <td>{{data.updatorName}}</td>
        <td>{{data.updateTime}}</td>
        <td>{{data.flgDeleted}}</td>
        <td>
          <button @click="getdelete(data.id)">删除</button>
          <button @click="getdataById(data.id)">修改</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Configjs from "src/config/config.js";
export default {
  name: "Tset1",
  data() {
    return {
      url: "http://localhost:8080/moduledemo/fun11/fun11demolist/listJSON.do",
      deleteUrl:
        "http://localhost:8080/moduledemo/fun11/fun11demodelete/delete.do",
      data: [],
      selDrderTitle: ""
    };
  },
  components: {
    Configjs
  },
  methods: {
    getdata() {
      this.post(
        this.url,
        {
          orderTitle: this.selDrderTitle
        },
        (isScuss, res) => {
          if (isScuss) {
            this.data = res.Rows;
            this.loadingClose();
          }
        }
      );
    },
    getdataTitle() {
      console.log(this.selDrderTitle);
      this.post(
        this.url,
        {
          orderTitle: this.selDrderTitle
        },
        (isScuss, res) => {
          if (isScuss) {
            this.data = res.Rows;
            this.loadingClose();
          }
        }
      );
    },
    getdelete(deleteId) {
      this.post(
        this.deleteUrl,
        {
          ids: deleteId
        },
        (isScuss, res) => {
          if (isScuss) {
            this.getdata();
          }
        }
      );
    },
    getdataById(id) {
      this.post(
        this.url,
        {
          id: id
        },
        (isScuss, res) => {
          console.log(res.Rows.createTime);
          if (isScuss) {
            this.loadingClose();
            this.$router.push({
              path: "/test/test2",
              query: { data1: res.Rows[0] }
            });
          }
        }
      );
    }
  },
  created() {
    this.getdata();
  }
};
</script>

<style scoped>
button {
  width: 100px;
  height: 30px;
  margin-bottom: 10px;
}
td {
  text-align: center;
  padding: 5px;
}
#but1 {
  margin: 0 15px;
}
</style>
