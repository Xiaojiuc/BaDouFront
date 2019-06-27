<template>
  <auth-layout pageClass="modifypsw-page">
    <div class="row d-flex justify-content-center">
      <fade-render-transition>
        <card>
          <div slot="header">
            <h3 class="card-title text-center">注册</h3>
          </div>
          <div>
            <fg-input type="password" placeholder="邮箱地址" v-model="email"></fg-input>
            <div class = 'captcha'>
              <fg-input  placeholder="请输入验证码" class="code_input" v-model="picLyanzhengma"></fg-input>
              <div class="code" @click="refreshCode">
                <s-identify :identifyCode="identifyCode"></s-identify>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button  class="btn btn-fill btn-info btn-round btn-wd " @click='login(model)'>提交</button>
            <br>
            <div class="forgot">
              <router-link to="/login" class="card-category">
                返回
              </router-link>
            </div>
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

  export default {
    components: {
      FadeRenderTransition,
      AuthLayout,
      SIdentify
    },
    data(){
      return {
        email:'', //邮箱地址
        userName:'', //设置账户名
        password:'', //密码
        comfirePsw:'', //确认密码
        authorization:'', //设置授权码
        identifyCodes: "1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM", //设置授权码生成验证码所需字符
        identifyCode: "", //生成验证码
        picLyanzhengma:'', //输入框验证码
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
  .modifypsw-page .content{
      padding-top: 12vh;
  }
</style>
