<template>
  <div>
    <location :menuPath="menuPath"></location>
    <div class="row">
      <div class="col-md-12">
        <form ref="modifyPwdForm" class="form-horizontal">
          <card>

            <div slot="header">
              <h4 class="card-title">
                修改信息
              </h4>
            </div>
            <div class="row">
              <div class="col-lg-6">
                <fg-input name="logonId"
                          disabled
                          label="登录账号"
                          v-model="model.logonId">
                </fg-input>
              </div>
              <div class="col-lg-6">
                <fg-input name="logonId"
                          disabled
                          label="编码"
                          v-model="model.code">
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <fg-input name="email"
                          disabled
                          label="邮箱"
                          v-model="model.email">
                </fg-input>
              </div>
              <div class="col-lg-6">
                <fg-input name="name"
                          label="名称"
                          required
                          v-validate="modelValidations.name"
                          v-model="model.name"
                          :error="getError('name')">
                </fg-input>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <fg-input name="tel"
                          label="电话"
                          v-validate="modelValidations.tel"
                          v-model="model.tel"
                          :error="getError('tel')">
                </fg-input>
              </div>
              <div class="col-lg-6">
                <fg-input name="qq"
                          label="qq"
                          v-model="model.qq">
                </fg-input>
              </div>
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
  import {Location} from 'src/components/index'

  export default {
    components: {
      Location
    },
    data() {
      return {
        model: {
          id: '',
          logonId: '',
          name: '',
          code: '',
          tel: '',
          qq: '',
          email: '',
        },
        modelValidations: {
          name: {
            required: true,
          },
          tel: {
            max: 64
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
          id: this.model.id,
          name: this.model.name,
          tel: this.model.tel,
          qq: this.model.qq
        }
        let url = `${this.BASEURL}/org/employee/employeesave/updateMyInfo.do`
        this.post(url, params, (isSuccess, res) => {
          if (res.hasOk) {
            let info = this.$store.getters['user/info']
            info.name = this.model.name
            info.tel = this.model.tel
            info.qq = this.model.qq
            this.$store.commit('user/save', info)
            this.alert('操作成功', 'success')
          } else {
            let tip = res.message || ''
            this.alert(`操作失败 ${tip}`)
          }
        }, true)
      }
    },
    created: function () {
      Validator.localize('zh_CN', {
        attributes: {
          name: '名称',
          tel: '电话'
        }
      })

      let info = this.$store.getters['user/info']
      Object.keys(this.model).forEach(key => {
        this.model[key] = info[key]
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
