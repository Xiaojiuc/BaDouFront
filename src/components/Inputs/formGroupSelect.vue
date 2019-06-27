<template>
    <div class="form-group"
         :class="[
       {'input-group': hasIcon},
       {'has-right-slot': addonRightIcon || this.$slots.addonRight},
       {'has-error': error},
       {'input-group-focus': focused},
       {'has-label': label || $slots.label},
       {'has-success': !error && touched && hadError}]">
        <slot name="label">
            <label v-if="label" :class="labelClasses">
                {{label}}
                <span v-if="required" style="color: red;">*</span>
            </label>
        </slot>

        <span v-if="addonLeftIcon || $slots.addonLeft" class="input-group-addon input-group-prepend">
      <slot name="addonLeft">
        <i :class="addonLeftIcon"></i>
      </slot>
    </span>
        <slot>
            <el-select class="select-default"
                       size="large"
                       @change="updateValue"
                       :value="value"
                       :disabled="isView"
                       placeholder="请选择"
                       :name="name">
                <el-option v-for="o in selectOptions"
                           class="select-default"
                           :value="o.id"
                           :label="o.text"
                           :key="o.id">
                </el-option>
            </el-select>
        </slot>
        <span v-if="addonRightIcon || $slots.addonRight" class="input-group-addon input-group-append">
      <slot name="addonRight">
        <i :class="addonRightIcon"></i>
      </slot>
    </span>

        <slot name="infoBlock"></slot>
        <slot name="helpBlock">
            <div class="text-danger invalid-feedback" style="display: block;" :class="{'mt-2': hasIcon}" v-if="error">
                {{ error }}
            </div>
        </slot>
    </div>
</template>
<script>
    import {Select, Option} from 'element-ui'

    export default {
        components: {
            [Option.name]: Option,
            [Select.name]: Select
        },
        inheritAttrs: false,
        name: 'fg-select',
        props: {
            required: Boolean,
            label: String,
            error: String,
            labelClasses: String,
            inputClasses: String,
            addonRightIcon: String,
            addonLeftIcon: String,
            options: Array,
            value: [String, Number],
            name: String,
            moduleField: Object,
            isView: Boolean,
        },
        data() {
            return {
                touched: false,
                focused: false,
                hadError: false,
                selectOptions: []
            }
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.updateValue
                }
            },
            hasIcon() {
                const {addonRight, addonLeft} = this.$slots
                return addonRight !== undefined || addonLeft !== undefined || this.addonRightIcon !== undefined || this.addonLeftIcon !== undefined
            }
        },
        methods: {
            updateValue(evt) {
                this.$emit('input', evt)
                let text = ''
                for (let i = 0; i < this.selectOptions.length; i++) {
                    if (this.selectOptions[i].id === evt) {
                        text = this.selectOptions[i].text
                        break
                    }
                }
                // 可能需要保存下拉值所对应的text，抛出 text-change 事件
                this.$emit('text-change', text)
            }
        },
        watch: {
            moduleField: {
                deep: true,
                immediate: true,
                handler: function () {
                    this.selectOptions = this.options
                    let dataUrl = this.moduleField.fun
                    if ((!this.selectOptions || this.selectOptions.length == 0) && dataUrl) {
                        this.get(this.BASEURL + dataUrl, {}, (_, data) => this.selectOptions = data, true)
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .input-group.has-right-slot input {
        border-right: 0;
    }

</style>
