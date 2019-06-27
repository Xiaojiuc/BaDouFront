<template>
    <card :title="title">
        <div>
            <div class="col-sm-12" style="padding-left: 0;padding-right: 0;">
                <el-table stripe
                          ref="listTable"
                          style="width: 100%;"
                          :data="rows"
                          @selection-change="selection = $event"
                          @row-click="rowClick"
                          border>

                    <el-table-column
                        v-if="showSelection"
                        type="selection"
                        width="55">
                    </el-table-column>

                    <el-table-column
                        v-if="lineNumber"
                        type="index"
                        label="序号"
                        width="65">
                    </el-table-column>

                    <template v-for="column in columns">
                        <el-table-column :key="column.name"
                                         :min-width="column.minWidth"
                                         :prop="column.prop"
                                         :label="column.label"
                                         :formatter="column.formatter">
                            <template slot-scope="scope">
                                <div @click="handColumnClick(column, scope.row, scope.column, scope.$index)" v-html="formatterColum(scope.row, scope.column, scope.$index)"></div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>

        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
             style="padding-left: 0;padding-right: 0;">
            <div class="page-info">
                <p class="card-category">
                    <span>显示第 {{from + 1}} 到第 {{to}} 条记录，总共 {{total}} 条记录</span>
                    <span v-if="pageInfo" style="margin-left: 10px;">
            每页显示
              <el-select
                  class="select-default mb-3"
                  style="width: 70px"
                  v-model="pagination.perPageSize"
                  placeholder="Per page">
                <el-option
                    class="select-default"
                    v-for="item in pagination.perPageOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            条记录
          </span>
                </p>
            </div>


            <l-pagination v-if="pageInfo" class="pagination-no-border"
                          v-model="pagination.pageNo"
                          :per-page="pagination.perPageSize"
                          :total="pagination.total"
                          @input="refresh">
            </l-pagination>
        </div>
    </card>
</template>

<script>

    import {Table, TableColumn, Select, Option} from 'element-ui'
    import LPagination from '../Pagination'

    const DEFAULT_PER_PAGE_SIZE = 10

    export default {
        name: "pagelist",
        components: {
            LPagination,
            [Select.name]: Select,
            [Option.name]: Option,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn
        },
        props: {
            url: {
                type: String,
                required: true
            },
            queryParams: {
                type: Object,
                default() {
                    return {}
                }
            },
            columns: {
                type: Array,
                required: true
            },
            title: {
                type: String
            },
            /*
             * 是否加载数据，用于父组件控制子组件是否可以进行数据的加载。
             * 例如 在模型渲染列表的场景下，需要先获取到模型数据，才可以进行列表数据的查询，所以在页面渲染的时候
             * 把这个属性设置为false，等到获取到模型数据后，将该属性设置为true，并且调用获取数据的方法
             */
            loadData: {
                type: Boolean,
                default: true
            },
            pageInfo: {
                type: Boolean,
                default: true
            },
            sortname: {
                type: String,
                default: ''
            },
            sortorder: {
                type: String,
                default: 'desc'
            },
            showSelection: {
                type: Boolean,
                default: true
            },
            lineNumber: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                rows: [],
                pagination: {
                    perPageSize: DEFAULT_PER_PAGE_SIZE,
                    pageNo: 1,
                    perPageOptions: [10, 25, 50, 100],
                    total: 0
                },
                // 存储选中的数据，在父组件中直接获取即可
                selection: []
            }
        },
        computed: {
            to() {
                let highBound = this.from + this.pagination.perPageSize
                if (this.total < highBound) {
                    highBound = this.total
                }
                return highBound
            },
            from() {
                return this.pagination.perPageSize * (this.pagination.pageNo - 1)
            },
            total() {
                return this.pagination.total
            }
        },
        methods: {
            /**
             * 刷新列表
             */
            refresh() {
                let params = {
                    pageNo: this.pagination.pageNo,
                    perPageSize: this.pagination.perPageSize
                }

                if (this.queryParams) {
                    Object.assign(params, this.queryParams)
                }

                if (this.sortname) {
                    params.sortname = this.sortname
                    params.sortorder = this.sortorder
                }

                this.post(this.url, params, (isSuccess, res) => {
                    if (isSuccess) {
                        this.rows = res.Rows
                        this.pagination.total = res.Total
                        /*
                         * 如果获取到的数据为空，并且当前页面不是第一页时，加载上一页的数据
                         * 删除当前页所有记录的时候会出现这个情况
                         */
                        if (this.rows.length === 0 && this.pagination.pageNo > 1) {
                            this.pagination.pageNo--
                            this.refresh()
                        }
                    }
                }, true)
            },
            /**
             * 重置分页，所选数据的信息
             */
            reset() {
                this.pagination.perPageSize = DEFAULT_PER_PAGE_SIZE
                this.pagination.pageNo = 1
                this.selection = []
                this.refresh()
            },
            rowClick(row) {
                if (this.showSelection) {
                    this.$refs.listTable.toggleRowSelection(row)
                }
            },
            formatterColum(row, column, index) {
                let value = row[column.property]
                if (column.formatter) {
                    return column.formatter(row, column, value, index, this)
                }
                return value
            },
            handColumnClick(columnDef, row, column, index) {
                if (columnDef.c_hander) {
                    columnDef.c_hander(row, row[column.property], index, this)
                }
            }
        },
        created() {
            if (!this.loadData) {
                return
            }
            this.refresh()
        }
    }
</script>

<style scoped>
    .col-sm-12 {
        padding: 0;
    }

    .page-info >>> .select-default.el-select .el-input .el-input__icon {
        background-color: rgba(0,0,0,0);
    }
</style>
