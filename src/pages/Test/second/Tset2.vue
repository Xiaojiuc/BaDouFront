<template>
  <div>
    <button id="lists" @click="lists">返回列表</button>
    <div>
      <div id="div1">
        <ul>
          <li>orderTitle</li>
          <li>remark</li>
          <li>salmon</li>
          <!-- <li>createTime</li>
          <li>creator</li>
          <li>creatorName</li>
          <li>updateTime</li>
          <li>updator</li>
          <li>updatorName</li>
          <li>flgDeleted</li>
          <li>id</li>-->
        </ul>
      </div>
      <div id="div2">
        <ul>
          <li>
            <input type="hidden" name="id" v-model="id">
          </li>
          <li>
            <input type="text" name="orderTitle" v-model="orderTitle">
          </li>
          <li>
            <input type="text" name="remark" v-model="remark">
          </li>
          <li>
            <input type="text" name="salmon" v-model="salmon">
          </li>
          <!-- <li>
            <input type="text" name="creator" v-model="creator">
          </li>
          <li>
            <input type="text" name="creatorName" v-model="creatorName">
          </li>
          <li>
            <input type="Date" name="createTime" v-model="createTime">
          </li>
          <li>
            <input type="text" name="updator" v-model="updator">
          </li>
          <li>
            <input type="text" name="updatorName" v-model="updatorName">
          </li>
          <li>
            <input type="Date" name="updateTime" v-model="updateTime">
          </li>
          <li>
            <input type="text" name="flgDeleted" v-model="flgDeleted"> 
          </li>-->
        </ul>
      </div>
    </div>
    <button id="subb" @click="setSave">提交</button>
  </div>
</template>

<script>
import Configjs from "src/config/config.js";

export default {
  name: "Tset2",
  data() {
    return {
      url: "http://localhost:8080/moduledemo/fun11/fun11demosave/save.do",
      id: "",
      orderTitle: "",
      remark: "",
      salmon: ""
      //   creator: "",
      //   creatorName: "",
      //   createTime: "",
      //   updator: "",
      //   updatorName: "",
      //   updateTime: "",
      //   flgDeleted: ""
    };
  },
  components: {
    Configjs
  },
  methods: {
    getdata() {
      if (this.$route.query.data1 != null) {
        this.id = this.$route.query.data1.id,
        this.orderTitle = this.$route.query.data1.orderTitle,
        this.remark = this.$route.query.data1.remark,
        this.salmon = this.$route.query.data1.salmon
      }
    },
    lists() {
      this.$router.push({ path: "/test/test1" });
    },
    setSave() {
      this.post(
        this.url,
        {
          id: this.id,
          orderTitle: this.orderTitle,
          remark: this.remark,
          salmon: this.salmon
        },
        (isScuss, res) => {
          if (res.hasOk) {
            this.$router.push({ path: "/test/test1" });
            this.loadingClose();
            console.log(this.id);
            if(!this.id){
              alert("添加成功");
            }else{
              alert("修改成功");
            }
          } else {
            alert("添加失败:::::::" + "\n" + res.message);
            this.loadingClose();
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
#div1 li {
  padding-top: 4px;
}
li {
  line-height: 30px;
  text-align: center;
  border: blue solid 1px;
}
#div1 {
  height: 100%;
  float: left;
  width: 20%;
}
#div2 {
  height: 100%;
  float: left;
  width: 80%;
}
#subb {
  margin: auto;
  width: 100px;
  height: 30px;
}
#lists {
  margin: 10px 0px 10px 30px;
}
</style>
