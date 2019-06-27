<!--
  下拉多选框
  JSON配置格式：{"id":"type", "name":"类型", "selectType":0, "valueText":"全部", "isExtended":false}
-->
<template>
  <div class="search-value">
    <span>{{selector.name}}:</span>
    <el-popover
      placement="bottom"
      width="150"
      trigger="click">
      <el-checkbox-group v-model="checkList" @change="change">
        <el-checkbox
          v-for="item in selector.searchCondition"
          :key="item.id"
          :label="item.id">
          {{item.text}}
        </el-checkbox>
      </el-checkbox-group>
      <el-button slot="reference" class="text-style" plain>{{selectDataText}}</el-button>
    </el-popover>
  </div>
</template>

<script>
  import {Popover, Checkbox, CheckboxGroup} from 'element-ui'

  export default {
    name: "s-multiple-select",
    components: {
      [Popover.name]: Popover,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup
    },
    props: {
      selector: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dataText: '',
        checkList: []
      }
    },
    computed: {
      selectDataText() {
        return this.dataText || '全部'
      }
    },
    methods: {
      change() {
        let condition = this.selector.searchCondition
        if (condition) {
          let name = condition.filter(c => this.checkList.indexOf(c.id) > -1).map(c => c.text)
          this.dataText = name.join(',')
        }
        this.$emit('change')
      },
      getSelectorValue() {
        if (this.checkList.length > 0) {
          return {name: this.selector.id, type: 'other-query', value: this.checkList.join(';')}
        }
      },
      reset() {
        this.checkList = []
        this.dataText = '全部'
      },
      setValue(value) {
        if (!value) {
          return
        }
        let condition = this.selector.searchCondition
        if (condition) {
          let arr = value.split(';')
          this.checkList.push(...arr)
          this.dataText = condition.filter(c => this.checkList.indexOf(c.id) > -1)
            .map(c => c.text).join(',')
        }
      },
      getSelectorInfo() {
        return this.selector
      }
    }
  }
</script>

<style scoped>

</style>
