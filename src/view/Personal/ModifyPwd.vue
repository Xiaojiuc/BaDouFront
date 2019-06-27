<template>
  <div>
    <location :menuPath="menuPath"></location>
    <div class="row">
    <div class="col-md-12">
      <form ref="modifyPwdForm" class="form-horizontal">
        <card>

          <div slot="header">
            <h4 class="card-title">
              修改密码
            </h4>
          </div>
          <div>
            <fg-input name="password"
                      type="password"
                      label="密码"
                      required
                      v-validate="modelValidations.password"
                      v-model="model.password"
                      :error="getError('password')">
            </fg-input>

            <fg-input name="passwordNew"
                      type="password"
                      label="新密码"
                      required
                      v-validate="modelValidations.passwordNew"
                      v-model="model.passwordNew"
                      :error="getError('passwordNew')">
            </fg-input>

            <fg-input name="passwordOk"
                      type="password"
                      label="确认新密码"
                      required
                      v-validate="modelValidations.passwordOk"
                      v-model="model.passwordOk"
                      :error="getError('passwordOk')">
            </fg-input>
          </div>
          <div class="bottom-btn">
            <button @click.prevent="validate" class="btn btn-primary">保存</button>
          </div>

        </card>
      </form>
    </div>
  </div>
  </div>
</template>

<script>

  import {Validator} from 'vee-validate'
  import CryptoUtils from '@/js/CryptoUtils.js'
  import {Location} from 'src/components/index'

  export default {
    components: {
      Location
    },
    data() {
      return {
        model: {
          password: '',
          passwordNew: '',
          passwordOk: ''
        },
        modelValidations: {
          password: {
            required: true,
          },
          passwordNew: {
            required: true,
            min: 6
          },
          passwordOk: {
            required: true,
            min: 6,
            equalsToPwd: true
          }
        },
        menuPath: ''
      }
    },
    methods: {
      getError(fieldName) {
        return this.errors.first(fieldName)
      },
      validate() {
        this.$validator.validateAll().then(valid => valid && this.submit())
      },
      submit() {
        let params = {
          password: CryptoUtils.aesEncrypt(this.model.password),
          passwordNew: CryptoUtils.aesEncrypt(this.model.passwordNew),
          passwordOk: CryptoUtils.aesEncrypt(this.model.passwordOk),
        }
        this.post(this.INTERFACE.updatePwd, params, (isSuccess, res) => {
          if (res.hasOk) {
            this.alert('操作成功', 'success')
            this.model.password = ''
            this.model.passwordNew = ''
            this.model.passwordOk = ''
            this.$validator.reset()
          } else {
            let tip = res.message || ''
            this.alert(`操作失败 ${tip}`, 'error')
          }
        }, true)
      }
    },
    created: function () {
      Validator.localize('zh_CN', {
        attributes: {
          password: '密码',
          passwordNew: '新密码',
          passwordOk: '确认新密码'
        }
      })
      Validator.extend('equalsToPwd', {
        getMessage: () => '两次输入的新密码不一致',
        validate: value => value === this.model.passwordNew
      })
      this.menuPath = this.$route.path
    }
  }
</script>
<style scoped>
  .bottom-btn {
    text-align: center;
  }
</style>
