<template>
  <div class="main pad10">
    <div class="main-header">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addJdr">新增审核员</el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="refreshJdr('refresh')">刷新</el-button>
      <el-input
        v-model="searchVal"
        placeholder="查询：输入姓名、工号"
        prefix-icon="el-icon-search"
        class="el-input-jdr"
        clearable
      ></el-input>
    </div>
    <div class="main-content" ref="main-content">
      <el-table
        ref="jdrTable"
        :data="tableData.slice((paging.currentPage - 1 ) * paging.pagesize, paging.currentPage * paging.pagesize)"
        :height="tableHeight"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="transparent"
        border
        highlight-current-row
        :header-row-style="{ color: '#01AAED' }"
        style="width: 100%; min-width: 1500px;">
        <el-table-column
          type="index"
          width="90"
          label="#"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="xm"
          label="姓名"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gh"
          label="工号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="职务"
          align="center"
          :filters="job"
          :filter-method="filterJob"
        >
          <template slot-scope="{ row }">
            <el-tag :type="getJob(row.zw).tag">{{getJob(row.zw).text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="400">
          <template slot-scope="{ row }">
            <el-button type="success" size="small" plain @click="getQdb(row)">查看签到表</el-button>
            <el-button type="primary" size="small" plain @click="updateJdr(row)">修改信息</el-button>
            <el-popconfirm title="确定删除吗？" placement="top" @onConfirm="deleteJdr(row)">
              <el-button type="danger" plain size="small" slot="reference" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main-footer">
      <pagination
        :total="total"
        :paging="paging"
        @pagination="handleSizeChange">
      </pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      class="jdr-add-dialog"
      width="450px"
      top="150px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <el-form :model="params" :rules="rules" ref="ruleForm" label-position="top" label-width="100px" status-icon>
          <el-form-item label="审核员姓名" prop="xm">
            <el-input v-model="params.xm" placeholder="请填写审核员姓名"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogType === 'add'" label="易班id" prop="ybid">
            <el-input v-model="params.ybid" placeholder="请填写易班id"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogType === 'add'" label="工号" prop="gh">
            <el-input v-model="params.gh" placeholder="请填写工号"></el-input>
          </el-form-item>
          <el-form-item
            class="state-form-item"
            label="职务"
            prop="zw">
            <el-select v-model="params.zw" placeholder="请选择职务">
              <el-option
                v-for="(item, index) of job"
                :key="index"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="handleJdrSubmit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="dialogQdbTitle"
      :visible.sync="dialogQdbVisible"
      class="qdb-dialog"
      width="900px"
      top="90px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <el-table
          ref="table"
          :data="qdblist"
          :height="qdbTableHeight"
          empty-text="无签到记录"
          border
          style="width: 100%">
          <el-table-column
            prop="shyid"
            label="易班id"
            align="center">
          </el-table-column>
          <el-table-column
            prop="xq"
            label="签到校区"
            align="center">
          </el-table-column>
          <el-table-column
            label="签到(退)时间"
            align="center">
            <template slot-scope="{ row }">
              <span>{{ row.qdsj | dateformat }}</span>
              <el-tag v-if="row.state == '1'" type="success">签到</el-tag>
              <el-tag v-else type="danger">签退</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="color: #409EFF; font-size: 13px; padding: 10px;">默认查询最近30天签到记录</div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getChecker, updateJdr } from '@/api/jdr'
  import { getDeclare } from '@/api/bxd'
  import { copyObj, message } from '@/utils/common'
  import config from '@/config/index'
  import Pagination from '@/components/Pagination' // 分页插件
  import { AdminServlet } from '@/api/AdminServlet'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Checker', // 审核员
    components: { Pagination },
    data() {
      return {
        switchAutoMonior: true, // 自动监控
        timer: null, // 定时器
        loading: false, // 表格数据加载状态
        tableHeight: null, // 表格高度
        jdrData: [], // 接单人, 表格数据
        qdblist: [], // 签到表数据
        searchVal: '', // 查询关键词
        paging: copyObj(config.paging), // 分页的信息
        job: config.job,
        dialogVisible: false, // 添加接单人弹窗
        dialogTitle: '', // 弹窗标题
        dialogType: '', // 添加或修改
        dialogQdbTitle: '',
        dialogQdbVisible: false,
        qdbTableHeight: 700,
        // 审核员参数
        params: {
          op: '', // 固定参数* newpeople或uppeople
          xm: '', // 姓名*（审核员、接单人）
          ybid: '', // 易班id*（审核员、接单工人）
          gh: '', // 工号*（审核员、接单人）
          zw: '', // 职务*（审核员）1普通职员，2高级职员
          del: '' // 传递1或者不传递。优先级最高，如果传递了，则直接删除接单人或者审核员
        },
        // 签到表参数
        qdbParams: {
          op: 'selqdb', // 调用方法*，固定值
          shyid: '', // 审核员易班id*
          num: '' // 查询天数，不填则默认查询最近30天的签到情况
        },
        rules: {
          xm: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          ybid: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          gh: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          zw: { required: true, message: '必填项', trigger: ['blur', 'change'] }
        }
      }
    },
    computed: {
      ...mapGetters(['config']),
      total() {
        return this.tableData.length
      },
      tableData() {
        const search = this.searchVal
        if (search) {
          return this.jdrData.filter(data => {
            return Object.keys(data).some(key => {
              // 查询关键字：姓名、工号
              if (key === 'xm' || key === 'gh') {
                return String(data[key]).toLowerCase().indexOf(search) > -1
              }
            })
          })
        }
        return this.jdrData
      }
    },
    mounted() {
      this.tableHeight = this.$refs['main-content'].offsetHeight
      this.getJdrList()
      this.autoMonitor()
    },
    methods: {
      /**
       * 自动监控，每隔n秒刷新一次数据
       */
      autoMonitor() {
        this.stopMonitor()
        if (this.switchAutoMonior && this.config.shytime) {
          this.timer = setInterval(this.queryData, this.config.shytime * 1000)
        }
      },
      /**
       * 停止自动监控
       */
      stopMonitor() {
        clearInterval(this.timer)
        this.timer = null
      },
      /**
       * 监控模式切换
       */
      handleMonitorSwitch() {
        if (this.switchAutoMonior) {
          this.autoMonitor()
          this.$message.success('自动监测已开启')
        } else {
          this.stopMonitor()
          this.$message.success('自动监测已关闭')
        }
      },
      /**
       * 查询数据
       */
      queryData() {
        // 获取申报中的报修单数量
        getDeclare()
      },
      /**
       * 获取审核员
       */
      getJdrList(refresh) {
        this.loading = true
        getChecker().then(response => {
          this.loading = false
          this.jdrData = response.obj.slist;
          if (refresh) {
            this.$message.success('刷新成功')
          }
        }).catch(() => {
          this.loading = false
          this.jdrData = []
          this.$message.error('数据获取失败，请检查接口')
        })
      },
      /**
       * 过滤参数，空值的不传递
       * @param params
       */
      filterParams(params) {
        const resultParams = {}
        for (const key in params) {
          if (params[key] || params[key] === 0) {
            resultParams[key] = params[key]
          }
        }
        return resultParams
      },
      resetParams() {
        for (const key in this.params) {
          this.params[key] = ''
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * 添加接单人
       */
      addJdr() {
        this.dialogType = 'add'
        this.dialogTitle = '添加审核员'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.resetParams()
          this.resetForm('ruleForm')
        })
      },
      /**
       * 修改接单人
       */
      updateJdr(row) {
        this.dialogType = 'update'
        this.dialogTitle = '修改审核员信息'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.resetForm('ruleForm')
          this.params['op'] = 'uppeople'
          this.params['shyid'] = row.ybid // 替换id字段
          this.params.xm = row.xm // 转数字类型
          this.params.zw = Number(row.zw) // 转数字类型
          this.params.ybid = '' // 置空ybid字段
          this.params.gh = '' // 置空gh字段
        })
      },
      /**
       * 删除接单人
       */
      deleteJdr(row) {
        const params = {
          op: 'uppeople',
          shyid: row.ybid, // 替换id字段
          del: 1
        }
        updateJdr(this.filterParams(params)).then(res => {
          if (res.status === 'success') {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败，请重试')
          }
          this.refreshJdr()
        }).catch(() => {
          this.$message.error('删除失败，请重试')
        })
      },
      /**
       * 确定添加，传递后台
       */
      handleJdrSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogType === 'add') {
              this.handleJdrAdd()
            } else if (this.dialogType === 'update') {
              this.handleJdrUpdate()
            }
          } else {
            return false
          }
        })
      },
      /**
       * 刷新表格，重新获取数据
       */
      refreshJdr(refresh) {
        if (refresh) {
          this.searchVal = ''
          this.clearFilter()
        }
        this.getJdrList(refresh)
      },
      /**
       * 添加，传递后台
       */
      handleJdrAdd() {
        this.searchVal = ''
        this.params['op'] = 'newpeople'
        updateJdr(this.filterParams(this.params)).then(res => {
          if (res.status === 'success') {
            this.$message.success('添加成功')
            this.dialogVisible = false
          } else {
            this.$message.error('添加失败，请重试')
          }
          this.refreshJdr()
        }).catch(() => {
          this.$message.error('添加失败，请重试')
        })
      },
      /**
       * 修改，传递后台
       */
      handleJdrUpdate() {
        updateJdr(this.filterParams(this.params)).then(res => {
          if (res.status === 'success') {
            this.$message.success('修改成功')
            this.dialogVisible = false
          } else {
            this.$message.error('修改失败，请重试')
          }
          this.refreshJdr()
        }).catch(() => {
          this.$message.error('修改失败，请重试')
        })
      },
      /**
       * pagesize改变时的触发事件
       * currentPage改变时的触发事件
       * @param paginationInfo
       */
      handleSizeChange(paging) {
        this.paging.currentPage = paging.currentPage
        this.paging.pagesize = paging.pagesize
      },
      /**
       * 根据value获取职务
       * @param value
       * @returns {T}
       */
      getJob(value) {
        const item = this.job.filter(item => {
          return item.value == value
        })
        return item && item[0]
      },
      /**
       * 过滤标签
       * @param value
       * @param row
       * @returns {boolean}
       */
      filterJob(value, row) {
        return row.zw == value
      },
      /**
       * 清除过滤器
       */
      clearFilter() {
        this.$refs.jdrTable.clearFilter()
      },
      /**
       * 读取签到表
       */
      getQdb(row) {
        const { xm, gh, ybid } = row
        this.dialogQdbVisible = true
        this.dialogQdbTitle = `${xm}(${gh}) -- 签到表`
        this.qdbParams['shyid'] = ybid
        let params = this.filterParams(this.qdbParams)
        this.$nextTick(() => {
          AdminServlet(params).then(res => {
            if (res.obj.qdblist) {
              this.qdblist = res.obj.qdblist
            } else {
              message(res)
            }
          })
        })

      }
    },
    activated() {
      this.autoMonitor()
    },
    beforeRouteLeave(to, from, next) {
      this.stopMonitor()
      next()
    }
  }
</script>
<style lang="scss">
  .jdr-add-dialog {
    .el-dialog {
      .el-dialog__body {
        padding: 30px 50px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;

        .el-dialog-div {
          .el-form-item {
            margin-bottom: 10px;

            .el-form-item__label {
              padding: 0;
            }
          }

          .state-form-item {
            .tips {
              font-size: 12px;
              color: #ff5151;
              line-height: 20px;
              margin-top: 10px;

              span {
                color: #1890FF;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .qdb-dialog {
    .el-dialog__body {
      padding: 0;
    }
  }

  .el-input-jdr {
    input {
      border-radius: 30px;
    }
  }
</style>
<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    /*min-width: 1200px;*/
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;

    &-header {
      width: 100%;
      padding: 10px 0 20px 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .el-input-jdr {
        width: 300px;
        position: absolute;
        right: 20px;
      }
    }

    &-content {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      box-sizing: border-box;
    }

    &-footer {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
    }
  }
</style>
