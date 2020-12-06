<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paging.currentPage"
      :page-sizes="paging.pagesizes"
      :page-size="paging.pagesize"
      :layout="layout"
      :background="background"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    paging: {
      type: Object,
      default: function() {
        return {
          currentPage: 1,
          pagesizes: [10, 20, 50, 100, 200],
          pagesize: 50
        }
      }
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // currentPage: 1,
      // pagesizes: [10, 20, 50, 100, 200],
      // pagesize: 50
    }
  },
  methods: {
    handleSizeChange(val) {
      this.paging.pagesize = val
      this.$emit('pagination', this.paging)
      this.$nextTick(() => {
        if (this.autoScroll) {
          scrollTo('el-table__body-wrapper', 0, 200)
        }
      })
    },
    handleCurrentChange(val) {
      this.paging.currentPage = val
      this.$emit('pagination', this.paging)
      this.$nextTick(() => {
        if (this.autoScroll) {
          scrollTo('el-table__body-wrapper', 0, 200)
        }
      })
    }
  }
}
</script>
