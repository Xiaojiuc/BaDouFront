<template>
  <div>
    <location :menuPath="menuPath"></location>
    <div class="row useravatar-page">
    <div class="col-md-12">
      <div class="bottom-btn">
        <button @click="uploadPhoto" class="btn btn-primary">保存</button>
      </div>
      <div class="table-row">
        <div slot="header">
          <h4 class="card-title">
            我的头像
          </h4>
        </div>
        <div class="picture">
          <div class="select" style="cursor: pointer;">
            <input type="file" id="filed" hidden="" @change="filePreview">
            <p @click="selectImg()">
              <span v-if="textHide">点击上传头像</span>
              <img :src="currentHeadImg" />
            </p>
            <span>提示：仅限上传png，jpg图片</span>
          </div>
          <div class="preview">
            <img :src="currentHeadImg" />
          </div>
        </div>
        <div slot="header">
          <h6 class="picture-title">
            我曾经使用过的头像
          </h6>
        </div>
        <div class="used">
          <img style="cursor: pointer;" v-for="img in hisHeadImg" :src="img.url" @click="changeImg(img.id)"  />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

  import {Validator} from 'vee-validate'
  import {Location} from 'src/components/index'

  export default {
    components: {
      Location
    },
    data() {
      return {
        currentHeadImg:'',
        textHide:true,
        attach: null,
        photoAttachId: '',
        hisHeadImg: [],
        menuPath: ''
      }
    },
    computed: {
    },
    methods: {
      uploadPhoto: function () {
        let url = `${this.BASEURL}/org/employee/employeesave/uploadPhoto.do`
        this.postFile(url, {attach: this.attach, photoAttachId: this.photoAttachId}, (isSuccess, res) => {
          if (res.hasOk) {
            let info = this.$store.getters['user/info']
            info.headImg = res.bean
            this.$store.commit('user/save', info)
            this.alert('操作成功', 'success')
            this.attach = null
          } else {
            let tip = res.message || ''
            this.alert(`操作失败 ${tip}`)
          }
        }, true)
      },
      selectImg:function(){
        document.getElementById('filed').click()
      },
      filePreview(e){
        let _this = this
        let files = e.target.files[0]
        if (!e || !window.FileReader) return  // 看支持不支持FileReader
        let reader = new FileReader()
        reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
        reader.onloadend = function () {
          _this.currentHeadImg = this.result
          _this.textHide=false;
        }
        this.attach = files
      },
      changeImg:function(attachId){
        this.currentHeadImg = `${this.INTERFACE.downloadAttach}?attachId=${attachId}`
        this.photoAttachId = attachId
      },
      // 渲染历史头像
      renderHisHeadImg () {
        let url = `${this.BASEURL}/org/employee/employeeedit/getHistoricalHeadImg.do`
        let info = this.$store.getters['user/info']
        this.get(url, {userId: info.id}, (isSuccess, res) => {
          this.hisHeadImg = res.attachs.map(e => {
           return  {url: `${this.INTERFACE.downloadAttach}?attachId=${e}`, id: e}
          })
        }, true)
      }
    },
    created: function () {
      this.menuPath = this.$route.path
      let img = this.$store.getters['user/info'].headImg
      if (img) {
        img = `${this.INTERFACE.downloadAttach}?attachId=${img}`
      }
     this.currentHeadImg = img || 'static/img/faces/face-0.jpg'
      this.renderHisHeadImg()
    }
  }
</script>
<style>
</style>
