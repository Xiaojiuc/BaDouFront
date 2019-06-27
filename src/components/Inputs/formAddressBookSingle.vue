<template>
    <div class="address-book-single"
        @mouseover="handerMouseover"
        @mouseout="handerMouseout">
        <div class="address-book-input-div">
        <input
            :name="name"
            :value="value"
            v-bind="$attrs"
            class="form-control address-book-input"
            aria-describedby="addon-right addon-left"/>
        <i class="el-input__icon"
           :class="{'el-icon-circle-close': removeIcon}"
            @click="handerRemove"></i>
        </div>
        <button type="button" class="btn btn-primary address-book-but" @click="choose">选择</button>
    </div>
</template>
<!--2;600-2-20-1-->
<script>
    export default {
        name: "form-addressBook-single",
        props: {
            // 地址本的类型 格式为 2-1-20-2 对应的配置项为type-singleChoose-selectType-indexType
            addressType: String,
            field: Object, // 模型 field
            name: String,
            valueId: [String, Number],
            valueText: [String, Number]
        },
        computed: {
            value() {
                return this.valueText || this.valueId
            }
        },
        data() {
            return {
                removeIcon: false
            }
        },
        methods: {
            choose() {
                let type = this.addressType.split('-')
                let indexType = type[3] || null
                if (indexType) {
                    indexType = parseInt(indexType)
                }
                this.addressBook({
                    type: type[0],
                    singleChoose: type[1] === '1',
                    selectType: type[2],
                    indexType: indexType
                }).then(data => {
                    let f = this.field
                    let d = data[0]
                    let result = {
                        id: d[f.valueFieldIdSrc],
                        text: d[f.valueFieldTextSrc],
                        data: data
                    }
                    this.$emit('change', result)
                })
            },
            handerMouseover() {
                this.removeIcon = this.valueText || this.valueId
            },
            handerMouseout() {
                this.removeIcon = false
            },
            handerRemove() {
                this.$emit('change', {id: '', text: ''})
            }
        }
    }
</script>

<style scoped>
    .address-book-single {
        position: relative;
    }

    .address-book-single .el-input__icon {
        position: absolute;
        top: 0;
        right: 0;
        transition: all .3s;
        color: #c0c4cc;
        font-size: 14px;
        cursor: pointer;
    }

    .address-book-input-div {
        position: relative;
        display: inline-block;
        width: calc(100% - 74px);
    }

    .address-book-but {
        max-width: 70px;
        margin-bottom: 1px;
    }
</style>
