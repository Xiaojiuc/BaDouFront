<template>
    <auth-layout pageClass="login-page">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col-lg-4 col-md-6 col-sm-8">
                <div>
                    <!--You can specify transitions on initial render. The `card-hidden` class will be present initially and then it will be removed-->
                    <fade-render-transition>
                        <card>
                            <div slot="header">
                                <h3 class="card-title text-center">登录</h3>
                            </div>
                            <div>
                                <fg-input placeholder="用户名"
                                          v-model="model.username">

                                </fg-input>
                                <fg-input type="password"
                                          placeholder="密码"
                                          v-model="model.password">
                                </fg-input>
                                <div class='captcha' v-if="isVerify==1">
                                    <fg-input placeholder="请输入验证码" class="code_input"
                                              v-model="picLyanzhengma"></fg-input>
                                    <div class="code" @click="refreshCode">
                                        <s-identify :identifyCode="identifyCode"></s-identify>
                                    </div>

                                    <!-- <fg-input  type="button"  @click="createCode"  class="verification" v-model="checkCode"/> -->
                                </div>
                                <!-- <fg-input>
                                  <l-checkbox v-model="model.subscribe">
                                    Subscribe to newsletter
                                  </l-checkbox>
                                </fg-input> -->
                            </div>
                            <div class="text-center">
                                <button class="btn btn-fill btn-info btn-round btn-wd " @click='login(model)'>登录
                                </button>
                                <br>
                                <div class="forgot" v-if="openRegister==1">
                                    <router-link to="/register" class="card-category">
                                        注册
                                    </router-link>
                                    <!-- <router-link to="/modifypsw" class="card-category">
                                      忘记密码
                                    </router-link> -->
                                </div>
                            </div>
                        </card>
                    </fade-render-transition>

                </div>
            </div>
        </div>
    </auth-layout>
</template>
<script>
    import {Checkbox as LCheckbox, FadeRenderTransition} from 'src/components/index'
    import AuthLayout from './AuthLayout.vue'
    import SIdentify from '../../../components/Plugin/identify.vue'
    import CryptoUtils from 'src/js/CryptoUtils.js'

    export default {
        components: {
            LCheckbox,
            FadeRenderTransition,
            AuthLayout,
            SIdentify
        },
        data() {
            return {
                model: {
                    username: '',
                    password: '',
                    subscribe: true
                },
                identifyCodes: "1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM",
                identifyCode: "",
                picLyanzhengma: '',
                isVerify: 0,
                openRegister: 0
            }
        },
        methods: {
            toggleNavbar() {
                document.body.classList.toggle('nav-open')
            },
            closeMenu() {
                document.body.classList.remove('nav-open')
                document.body.classList.remove('off-canvas-sidebar')
            },
            login: function (form) {
                if (!this.isCheckNull(form.username)) {
                    this.alert('请填写用户名')
                    return false
                }
                if (!this.isCheckNull(form.password)) {
                    this.alert('请填写密码')
                    return false
                }
                if (this.isVerify === 1) {
                    if (!this.isCheckNull(this.picLyanzhengma)) {
                        this.alert('请填写验证码')
                        return false
                    }
                    if (this.picLyanzhengma.toLowerCase() !== this.identifyCode.toLowerCase()) {
                        this.alert('验证码不正确')
                        return false
                    }
                }
                var params = {
                    username: form.username,
                    password: form.password
                }
                this.post(this.INTERFACE.logon, {data: CryptoUtils.aesEncrypt(JSON.stringify(params))}, (isSuccess, res) => {
                    if (isSuccess) {
                        this.loadingClose();
                        if (res.result) {
                            var token = res.message;
                            this.setItem('token', token)
                            // 将 keypress 事件去掉，防止其他页面点击回车时刷新
                            document.onkeypress = null
                            /*关闭加载页面*/
                            this.$router.push({
                                name: 'Overview'
                            })
                        } else {
                            if (res.message == 1) {
                                this.alert('用户名或密码错误')
                            } else if (res.message == 2) {
                                this.alert('用户没有对应角色')
                            } else if (res.message == 3) {
                                this.alert('密码错误,还剩' + res.lastTimes + '次机会')
                            } else if (res.message == 4) {
                                this.alert('今日登录次数已达上限')
                            } else if (res.message == 5) {
                                this.alert('用户已被冻结')
                            }
                        }
                    }
                })
            },

            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, 4);
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                        this.randomNum(0, this.identifyCodes.length)
                        ];
                }
            }
        },
        beforeDestroy() {
            this.closeMenu()
        },
        created() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
            let _this = this;
            document.onkeypress = function (event) {
                if (event.keyCode === 13) { // 13表示回车键
                    _this.login(_this.model)
                }
            }
        },
        mounted: function () {
            this.post(this.INTERFACE.findSystemInfo, {}, (isSuccess, res) => {
                if (isSuccess) {
                    this.isVerify = res.isVerify;
                    this.openRegister = res.openRegister;
                }
            }, true)
        }
    }
</script>
<style>
    .navbar-nav .nav-item p {
        line-height: inherit;
        margin-left: 5px;
    }

    .captcha {
        display: block;
    }

    .code_input {
        width: 60%;
        float: left;
        display: inline-block;
    }

    .code {
        width: fit-content;
        height: 40px;
        float: right;
        display: inline-block;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .login-page .card .btn-wd {
        min-width: 100%;
        border-radius: 5px;
    }

    .btn-round {
        border-radius: 5px !important
    }

    .login-page .forgot .card-category:first-child {
        float: left;
    }

    .login-page .forgot .card-category:last-child {
        float: right;
        color: rgba(241, 80, 80, 0.63);
    }

    .login-page .card {
        padding-top: 0;
        padding-bottom: 0
    }
</style>
