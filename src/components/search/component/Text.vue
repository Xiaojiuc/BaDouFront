<!--
  文本框搜索器
  JSON配置格式：{"id":"title", "name":"标题", "selectType":1, "isExtended":false, "value":""}
-->
<template>
  <div class="search-value">
    <label>{{selector.name}}:</label>
    <input v-model="value" @change="change"/>
  </div>
</template>

<script>
  export default {
    name: "s-text",
    props: {
      selector: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        value: ''
      }
    },
    methods: {
      change () {
        this.$emit('change')
      },
      getSelectorValue () {
        if (this.value) {
          return {name: this.selector.id, type: 'text-query', value: this.value}
        }
      },
      reset () {
        this.value = ''
      },
      setValue (value) {
        this.value = value
      },
      getSelectorInfo () {
        return this.selector
      }
    }
  }
</script>

<style scoped>

</style>
