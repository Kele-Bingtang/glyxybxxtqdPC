<template>
  <div class="main pad10">
    <div class="main-header">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addJdr">新增接单人</el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="refreshJdr('refresh')">刷新</el-button>
      <el-input
        v-model="searchVal"
        placeholder="查询：输入姓名、工号、电话、邮箱"
        prefix-icon="el-icon-search"
        class="el-input-jdr"
        clearable
      ></el-input>
      <div style="margin: 0 15px;">
        <el-tag type="danger">*若员工当前单数大于0，暂不能修改职务状态和删除该员工信息.</el-tag>
      </div>
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
          width="70"
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
          prop="sj"
          label="手机号码"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="yx"
          label="邮箱"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="dqds"
          label="当前单数"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="zjds"
          label="总计单数"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="pjpj"
          label="平均评价(星)"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
            prop="gs"
            label="剩余工时"
            align="center"
        >
          <template slot-scope="{ row }">
            <my-progress v-if="row.gs || row.gs == 0" :percentage="((2 - row.gs) / 2) * 100" :color="customColors" :format="format(row.gs)"></my-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="员工状态"
          align="center"
          :filters="states"
          :filter-method="filterState"
        >
          <template slot-scope="scope">
            <el-tag :type="getState(scope.row.state).tag">{{getState(scope.row.state).text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300">
          <template slot-scope="{ row }">
            <el-button type="success" size="small" plain @click="getQdb(row)">查看签到表</el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="updateJdr(row)">
              修改信息
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              placement="top"
              @onConfirm="row.dqds == 0 && deleteJdr(row)"
            >
              <el-button :type="row.dqds > 0 ? 'info' : 'danger'" plain size="small" :disabled="row.dqds > 0"
                         slot="reference" style="margin-left: 10px;">删除
              </el-button>
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
      width="660px"
      top="150px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <el-form :model="params" :rules="rules" ref="ruleForm" label-position="left" label-width="100px" status-icon>
          <el-form-item label="接单人姓名" prop="xm">
            <el-input v-model="params.xm" placeholder="请填写接单人姓名"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogType === 'add'" label="易班id" prop="ybid">
            <el-input v-model="params.ybid" placeholder="请填写易班id"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogType === 'add'" label="工号" prop="gh">
            <el-input v-model="params.gh" placeholder="请填写工号"></el-input>
          </el-form-item>
          <el-form-item label="业务范围" prop="ywfw" class="ywfw">
            <div class="ywfw-select">
<!--              <span>临桂校区</span>-->
              <el-cascader
                v-model="ywval"
                class="cascader-bxlb"
                placeholder="选择业务范围"
                @change="ywfwLgChange"
                :options="options"
                clearable
                :props="{ multiple: true }"
              ></el-cascader>
            </div>
<!--            <div class="ywfw-select">-->
<!--              <span>临桂校区</span>-->
<!--              <el-cascader-->
<!--                class="cascader-bxlb"-->
<!--                placeholder="选择业务范围"-->
<!--                @change="ywfwDcChange"-->
<!--                :options="options"-->
<!--                clearable-->
<!--                :props="{ multiple: true }"-->
<!--              ></el-cascader>-->
<!--            </div>-->
<!--            <div v-for="(item, index) in ywfw" :key="index" class="ywfw-select">-->
<!--              <span>{{item.text}}</span>-->
<!--              <el-select v-model="item.model" multiple collapse-tags placeholder="请选择区域"-->
<!--                         @change="handleYwfwSelect">-->
<!--                <el-option-->
<!--                  v-for="item in item.select"-->
<!--                  :key="item.id"-->
<!--                  :label="item.qy"-->
<!--                  :value="item.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </div>-->
          </el-form-item>
          <el-form-item label="手机号码" prop="sj">
            <el-input v-model="params.sj" placeholder="请填写手机号码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="yx">
            <el-input v-model="params.yx" placeholder="请填写邮箱"></el-input>
          </el-form-item>
          <el-form-item
            v-if="dialogType === 'update'"
            class="state-form-item"
            label="在职状态"
            prop="state">
            <el-select v-model="params.state" :disabled="params.dqds > 0" placeholder="请选择">
              <el-option
                v-for="(item, index) of states"
                :key="index"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-if="params.dqds > 0" class="tips">
              此员工目前接单数量为{{params.dqds}}，暂不能修改职务状态，如需修改请先前往报修单模块修改当前派单人之后再修改,是否
              <span @click="toRepair">前往?</span>
            </div>
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
              <span>{{ row.state == '1'? '(签到)' : '(签退)'}} </span>
            </template>
          </el-table-column>
        </el-table>
        <div style="color: #409EFF; font-size: 13px; padding: 10px;">默认查询最近30天签到记录</div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {DictListServlet} from '@/api/Dict'
  import { getJdr, updateJdr } from '@/api/jdr'
  import { JdrServlet } from '@/api/JdrServlet'
  import { getArea, getDeclare } from '@/api/bxd'
  import { copyObj } from '@/utils/common'
  import config from '@/config/index'
  import Pagination from '@/components/Pagination'
  import { mapGetters } from 'vuex'; // 分页插件
  import MyProgress from '@/components/ElProgress/progress'
  import { AdminServlet } from '@/api/AdminServlet'
  export default {
    name: 'Receiver', // 接单人
    components: { Pagination, MyProgress },
    data() {
      return {
        ywval:[],//业务范围的value
        options: [],
        switchAutoMonior: true, // 自动监控
        timer: null, // 定时器

        loading: false, // 表格数据加载状态
        tableHeight: null, // 表格高度
        jdrData: [], // 接单人, 表格数据
        searchVal: '', // 查询关键词
        paging: copyObj(config.paging), // 分页的信息
        states: [],
        dialogVisible: false, // 添加接单人弹窗
        dialogTitle: '', // 弹窗标题
        dialogType: '', // 添加或修改
        qdblist: [], // 签到表数据
        dialogQdbTitle: '',//签到表标题
        dialogQdbVisible: false,//签到表显示
        qdbTableHeight: 700,
        // 签到表参数
        qdbParams: {
          op: 'selqdb', // 调用方法*，固定值
          shyid: '', // 审核员易班id*
          num: '' // 查询天数，不填则默认查询最近30天的签到情况
        },
        ywfw: [
          { text: '临桂校区', value: 0, model: [], select: [] },
          { text: '东城校区', value: 1, model: [], select: [] }
        ],
        customColors: [
          {color: '#f56c6c', percentage: 25},
          {color: '#e6a23c', percentage: 50},
          {color: '#6f7ad3', percentage: 100},
          {color: '#5cb87a', percentage: 150}
        ],
        formKeys: [
          {
            name: '固定参数', // 表单显示名称
            prop: 'op', // 表单字段名称
            type: ['add'], // 类型
            hidden: true, // 是否显示
            placeholder: '输入类型名称', // form为true的前提下，表单输入提示文字
            rules: { required: true, message: '必填项', trigger: 'blur' } // form为true的前提下，该字段的校验规则
          },
          {
            name: '姓名',
            prop: 'xm',
            fetchType: ['add', 'update'], // 类型
            hidden: true, // 是否显示
            placeholder: '输入类型名称', // form为true的前提下，表单输入提示文字
            rules: { required: true, message: '必填项', trigger: 'blur' } // form为true的前提下，该字段的校验规则
          }
        ],
        params: { // 参数
          op: '', // 固定参数* newpeople或uppeople
          xm: '', // 姓名*（审核员、接单人）
          ybid: '', // 易班id*（审核员、接单工人）
          gh: '', // 工号*（审核员、接单人）
          ywfw: '', // 业务范围*（接单人）
          sj: '', // 手机
          yx: '', // 邮箱
          state: '', // 状态 添加时无需传递
          del: '' // 传递1或者不传递。优先级最高，如果传递了，则直接删除接单人或者审核员
        },
        rules: {
          xm: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          ybid: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          gh: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          ywfw: { required: true, message: '必填项(至少选择一项)', trigger: ['blur', 'change'] },
          sj: [
            { required: true, message: '必填项', trigger: ['blur', 'change'] },
            { pattern: /^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/, message: '手机号码格式不正确', trigger: 'blur' }
          ],
          yx: [
            { required: true, message: '必填项', trigger: ['blur', 'change'] },
            { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
          ],
          state: [
            { required: true, message: '请选择在职状态', trigger: ['blur', 'change'] }
          ]
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
              // 查询关键字：姓名、工号、手机、邮箱
              if (key === 'xm' || key === 'gh' || key === 'sj' || key === 'yx') {
                return String(data[key]).toLowerCase().indexOf(search) > -1
              }
            })
          })
        }
        return this.jdrData
      }
    },
    mounted() {
      this.states = config.states
      this.tableHeight = this.$refs['main-content'].offsetHeight
      this.getJdrList()
      this.getYwfw()
      this.autoMonitor()
      this.initDict()
    },
    methods: {
      //初始化接单人业务范围
      initDict(){
        DictListServlet().then(response => {
          this.options = response.obj;
        }).catch(() => {
          this.$message.error('查询接单人业务范围出错')
        })
      },
      /**
       * 自动监控，每隔n秒刷新一次数据
       */
      autoMonitor() {
        this.stopMonitor()
        if (this.switchAutoMonior && this.config.jdrtime) {
          this.timer = setInterval(this.queryData, this.config.jdrtime * 1000)
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
      getYwfw() {
        let me = this
        let campus = config.campus
        getQylist(0)
        async function getQylist(i) {
          if (i < campus.length) {
            let res = await getArea(campus[i].value)
            let item = me.ywfw[i]
            item.text = campus[i].text
            item.select = res.obj.qylist
            await getQylist(++i)
          }
        }
      },
      /**
       * 获取接单人
       */
      getJdrList(refresh) {
        this.loading = true
        getJdr().then(response => {
          this.loading = false
          this.jdrData = response.obj.jlist
          this.jdrData.forEach(v => {
            JdrServlet({
              op: 'selgs',
              ybid: v.ybid
            }).then(res => {
              this.$set(v, 'gs', res.obj & res.obj.gs)
            })
          })
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
          if (params[key]) {
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
        this.dialogTitle = '添加接单人'
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
        this.dialogTitle = '修改接单人信息'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.resetForm('ruleForm')
          this.params = copyObj(row)
          //回显业务范围
          let str = this.params.ywfw;
          let arr1 =  str.split('|');
          let arr2 = new Array(arr1.length)
          for (let i = 0; i < arr1.length; i++) {
            let temp = new Array(2);
            temp = arr1[i].split("-");
            arr2[i] = new Array(temp.length);
            for (let j = 0; j < temp.length; j++) {
              arr2[i][j] = temp[j];//完成字符串转换为二维数组
            }
          }
          this.ywval = arr2;
          this.params['jid'] = row.ybid // 替换接单人id字段
          this.params.state = Number(row.state) // 转数字类型
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
          jid: row.ybid, // 替换接单人id字段
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
        this.params['op'] = 'uppeople'
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
       * 根据state获取该项
       * @param state
       * @returns {T}
       */
      getState(state) {
        const item = this.states.filter(item => {
          return item.value == state
        })
        return item && item[0]
      },
      /**
       * 过滤标签
       * @param value
       * @param row
       * @returns {boolean}
       */
      filterState(value, row) {
        return row.state == value
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
        const { xm, gh, ybid } = row;
        this.dialogQdbVisible = true;
        this.dialogQdbTitle = `${xm}(${gh}) -- 签到表`;
        this.qdbParams['shyid'] = ybid
        let params = this.filterParams(this.qdbParams);
        this.$nextTick(() => {
          AdminServlet(params).then(res => {
            if (res.obj.qdblist) {
              this.qdblist = res.obj.qdblist
            } else {
              message(res)
            }
          })
        });
    },
      /**
       * 修改接单人职务状态
       */
      updateJdrState() {
        if (this.params.dqds > 0) {
          this.$confirm(`此员工目前接单数量为${this.params.dqds},暂不能修改职务状态,如需修改,请前往报修单模块修改派单人,是否前往?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/repair') // 跳转到报修单页面
          }).catch(() => {
          })
        }
      },
      /**
       * 跳转报修单路由
       */
      toRepair() {
        this.dialogVisible = false
        this.$router.push('/repair')
      },

      //业务范围多选监听（新）
      ywfwLgChange(currentVal){
        this.ywfw[0].model = [];
        for (let i = 0; i < currentVal.length; i++) {
          let ywfwValue = currentVal[i][0]+'-'+currentVal[i][1];
          this.ywfw[0].model.push(ywfwValue);
        }
        let arr = []
        let ywfw
        this.ywfw.map(v => {
          arr = arr.concat(v.model)
        })
        if (arr.length > 0) {
          ywfw = arr.join('|')
        } else {
          ywfw = null
        }
        this.params.ywfw = ywfw
      },
      // ywfwDcChange(currentVal){
      //   for (let i = 0; i < currentVal.length; i++) {
      //     let ywfwValue = currentVal[i][0]+'-'+currentVal[i][1];
      //     this.ywfw[1].model.push(ywfwValue);
      //   }
      //   console.log(this.ywfw[1].model);
      //   let arr = []
      //   let ywfw
      //   this.ywfw.map(v => {
      //     arr = arr.concat(v.model)
      //   })
      //   if (arr.length > 0) {
      //     ywfw = arr.join('|')
      //   } else {
      //     ywfw = null
      //   }
      //   this.params.ywfw = ywfw
      // },
      /**
       * 业务范围选择事监听
       * @param val
       */
      // handleYwfwSelect() {
      //   let arr = []
      //   let ywfw
      //   this.ywfw.map(v => {
      //     arr = arr.concat(v.model)
      //   })
      //   if (arr.length > 0) {
      //     // ywfw = 0
      //     // arr.map(v => {
      //     //   ywfw += Math.pow(2, v - 1)
      //     // })
      //     ywfw = arr.join('|')
      //   } else {
      //     ywfw = null
      //   }
      //   this.params.ywfw = ywfw
      // },
      format(gs) {
        let multiplier = 100
        let sygs = (2 * multiplier - gs * multiplier) / 100 // ×100 防止精度丢失
        return `${sygs}`;
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
        padding: 30px 120px 30px 100px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;

        .el-dialog-div {
          .el-form-item {
            margin-bottom: 30px;

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

          .ywfw {
            .ywfw-select {
              .el-select {
                width: 270px;
                margin-left: 10px;
              }
            }

            .ywfw-select:first-child {
              margin-bottom: 20px;
            }
          }
        }
      }
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
