<template>
  <auth-layout pageClass="register-page">
    <div class="row d-flex justify-content-center">
      <fade-render-transition>
        <card>
          <div slot="header">
            <h3 class="card-title text-center">注册</h3>
          </div>
          <div>
             <el-radio v-model="model.userType" label="1">普通用户</el-radio>
             <el-radio v-model="model.userType" label="2">企业用户</el-radio>
            <fg-input placeholder="邮箱" v-model="model.email"></fg-input>
            <fg-input placeholder="密码" type="password" v-model="model.password"></fg-input>
            <fg-input placeholder="确认密码" type="password" v-model="model.comfirePsw"></fg-input>
            <div class = 'captcha' v-if="isVerify==1">
              <fg-input  placeholder="请输入验证码" class="code_input" v-model="picLyanzhengma"></fg-input>
              <div class="code" @click="refreshCode">
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button  class="btn btn-fill btn-info btn-round btn-wd " @click='register(model)'>注册</button>
            <br>
          </div>
        </card>
      </fade-render-transition>
    </div>
  </auth-layout>
</template>
<script>
  import { FadeRenderTransition } from 'src/components/index'
  import AuthLayout from './AuthLayout.vue'
  import SIdentify from '../../../components/Plugin/identify.vue'
  import CryptoUtils from 'src/js/CryptoUtils.js'

  export default {
    components: {
      FadeRenderTransition,
      AuthLayout,
      SIdentify
    },
    data(){
      return {
        model: {
        email:'', //邮箱地址
        password:'', //密码
        comfirePsw:'', //确认密码
        userType: '1'
        },
        identifyCodes: "1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM", //设置授权码生成验证码所需字符
        identifyCode: "", //生成验证码
        picLyanzhengma:'', //输入框验证码
        isVerify: 0
      }
    },
    methods: {
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      },
      register: function (form) {
        if (!this.isCheckNull(form.email)) {
          this.alert('请填写邮箱')
          return false
        }
        if (!this.isCheckEmail(form.email)) {
          this.alert('请填写正确的邮箱')
          return false
        }
        if (!this.isCheckNull(form.password)) {
          this.alert('请填写密码')
          return false
        }
        if (!this.isCheckNull(form.comfirePsw)) {
          this.alert('请填写确认密码')
          return false
        }
        if(form.password!==form.comfirePsw) {
          this.alert('密码与确认密码不一致')
          return false
        }
        if(this.isVerify===1){
          if(!this.isCheckNull(this.picLyanzhengma)){
              this.alert('请填写验证码')
              return false
          }
          if(this.picLyanzhengma.toLowerCase()!==this.identifyCode.toLowerCase()){
              this.alert('验证码不正确')
              return false
          }
        }
        var params = {
          email: form.email,
          password: form.password,
          userType: form.userType
        }
        console.log(params)
        this.post(this.INTERFACE.register, {data:CryptoUtils.aesEncrypt(JSON.stringify(params))}, (isSuccess, res) => { 
          if (isSuccess) {
            this.loadingClose();
            if(res.hasOk){
              this.alert("注册成功！");
              this.$router.push({
						    name: 'Login'
					    })
            }else{
              this.alert(res.message);
            }
          }
        })
      },

      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      /*刷新验证码*/
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      /*随机生成验证码*/
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ];
        }
      }
    },
    beforeDestroy () {
      this.closeMenu()
    },
    created(){
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
      let _this = this;
      document.onkeypress = function(event) {
				if (event.keyCode == 13) { // 13表示回车键
					_this.register(_this.model)
				}
			}
    },
    mounted: function () {
        this.post(this.INTERFACE.findSystemInfo, {}, (isSuccess, res) => {
        if (isSuccess) {
            this.isVerify = res.isVerify;
        }
      }, true)
    }
  }
</script>
<style>
  .ml-auto, .mx-auto{
    margin-left: 0 !important
  }
  .card .btn-wd{
    min-width: 100%;
    border-radius: 5px;
  }
  .register-page .content{
      padding-top: 12vh;
  }
</style>
