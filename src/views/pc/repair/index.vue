<template>
  <div class="main pad10">
    <div class="main-header">
      <div class="main-header-item" style="width: 140px;">
        <el-date-picker
          v-model="params.startime"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions0"
          @change="handleSelectStarttime">
        </el-date-picker>
      </div>
      <div class="main-header-item" style="width: 140px;">
        <el-date-picker
          v-model="params.endtime"
          type="date"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1"
          @change="handleSelectEdntime">
        </el-date-picker>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-select v-model="params.xq" clearable placeholder="校区" @change="handleCampusChange">
          <el-option
            v-for="item in campus"
            :key="item.value"
            :label="item.text"
            :value="item.text">
          </el-option>
        </el-select>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-select v-model="params.qid" clearable placeholder="区域">
          <el-option
            v-for="item in arealist"
            :key="item.id"
            :label="item.qy"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-select v-model="params.state" clearable placeholder="申报单状态">
          <el-option
            v-for="(item, index) in progress"
            :key="index"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-select v-model="params.pj" clearable placeholder="评价星级">
          <el-option
            v-for="(item, index) of pjstar"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-select v-model="params.jid" filterable clearable placeholder="接单人">
          <el-option
            v-for="item of jdrData"
            :key="item.ybid"
            :label="item.xm"
            :value="item.ybid">
          </el-option>
        </el-select>
      </div>
      <div class="main-header-item" style="width: 140px;">
        <el-input
          placeholder="报修单号"
          v-model="params.bid"
          @input="params.bid = params.bid.replace(/[^\d]/g,'')"
          clearable>
        </el-input>
      </div>
      <div class="main-header-item">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
      <div class="main-header-item">
        <el-button type="success" icon="el-icon-search" @click="handleSearchAll">查询全部</el-button>
      </div>
      <div class="main-header-item" style="width: 130px;">
        <el-tag type="danger">*某一项若不选择参数则默认查询该项所有数据</el-tag>
      </div>
    </div>
    <div class="main-content" id="main-content" ref="main-content">
      <el-table
        :data="tableData.slice((paging.currentPage - 1 ) * paging.pagesize, paging.currentPage * paging.pagesize)"
        :height="tableHeight"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0)"
        border
        highlight-current-row
        :header-row-style="{ color: '#01AAED' }"
        style="width: 100%; min-width: 1500px;">
        <el-table-column
          type="index"
          width="50"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          label="报修单号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="bxtime"
          label="报修时间"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="报修内容"
          align="center"
        >
          <template slot-scope="scope">
            <div class="left">
              <el-tag type="warning" size="small">{{scope.row.bxlb}}</el-tag>
              <span>{{scope.row.bxnr}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="xq"
          label="校区"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="xxdd"
          label="地址"
          width="400"
          align="center"
        >
          <template slot-scope="scope">
            <div class="left">
              <el-tag v-if="scope.row.qy" type="warning" size="small">{{scope.row.qy}}</el-tag>
              <span>{{scope.row.xxdd}}</span>
            </div>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="ewmdd"-->
<!--          label="二维码地址"-->
<!--          align="center"-->
<!--        >-->
        <el-table-column
          prop="sbr"
          label="申报人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="j.xm"
          label="接单人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="getState(progress,scope.row.state).tag">
            {{getState(progress,scope.row.state).text}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="320">
          <template slot-scope="scope">

            <el-button-group>
              <!-- 查看报修单信息 -->
              <el-button type="success" size="small" icon="el-icon-view" plain @click="onViewDetail(scope.row)">查看
              </el-button>

              <!-- 状态为维修中的可以修报修单 -->
              <el-button type="primary" size="small" icon="el-icon-edit" plain @click="onModifyOrder(scope.row)">修改工单
              </el-button>

              <!-- 状态为申报中的可以指派派单人 -->
              <!--<el-button
                v-if="scope.row.state === 0"
                type="danger"
                size="small"
                plain
                @click="onAssignOrder(scope.$index, scope.row)"
              >
                指派接单人
              </el-button>-->

              <!-- 订单存在并且状态为维修中的可以修改派单人 -->
              <!--<el-button
                v-else-if="scope.row.jid !== null && scope.row.state === 1"
                type="warning"
                size="small"
                plain
                @click="changeAssignOrder(scope.$index, scope.row)"
              >
                修改接单人
              </el-button>-->

              <!-- 状态为已完成或已撤销的不能再操作 -->
              <!--<el-button
                v-if="scope.row.state === 2"
                type="success"
                size="small"
                icon="el-icon-check"
                plain>
                <span>工单完成</span>
              </el-button>
              <el-button
                v-else-if="scope.row.state === 3"
                type="info"
                size="small"
                icon="el-icon-close"
                plain>
                <span>工单撤销</span>
              </el-button>-->

              <el-popconfirm
                title="确定删除吗？"
                placement="top"
                @onConfirm="onDeleteOrder(scope.row)"
              >
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" plain>删除工单</el-button>
              </el-popconfirm>
            </el-button-group>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main-footer">
      <pagination
        :total="tableData.length"
        :paging="paging"
        @pagination="handleSizeChange">
      </pagination>
    </div>

    <!--报修单详情弹框-->
    <bxd-dialog
      :visible.sync="dialogVisible"
      :bxdInfo="bxdInfo"
    ></bxd-dialog>

    <!--修改接单人-->
    <el-dialog
      :title="jdrDialogTitle"
      :visible.sync="jdrDialogVisible"
      class="jdr-select-dialog"
      width="660px"
      top="150px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <div>
          <el-input
            v-model="jdrSearchVal"
            placeholder="查询：请输入姓名或电话"
            prefix-icon="el-icon-search"
            class="el-input-jdr"
            clearable
          ></el-input>
          <el-tag v-if="currJdrInfo.id" type="success" class="el-tag-jdr">
            <span>当前接单人：{{currJdrInfo.xm}} {{currJdrInfo.sj}} </span>
            <span v-if="currJdrInfo.state">[{{currJdrInfo.state}}]</span>
          </el-tag>
        </div>
        <el-radio-group v-model="jdrId">
          <el-radio
            v-for="item of jdrDatas"
            :disabled="item.state != 1 || item.id === currJdrInfo.id"
            :label="item.ybid"
            :key="item.ybid"
            border
          >
            <span class="xm">{{ item.xm }}</span>
            <span class="sj">{{ item.sj }}</span>
            <span class="sj">[{{ getState(states, item.state).text }}]</span>
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="jdrDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!jdrId || jdrId == currJdrInfo.id" plain
                   @click="handleJdrSelect">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改工单-->
    <el-dialog
      title="修改工单"
      :visible.sync="dialogVisibleModify"
      width="550px"
      top="100px"
      center
      :modal="true"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="dialog-body__modify">
        <el-form :model="modifyParams" :rules="modifyRules" ref="modifyForm" label-position="right" label-width="100px"
                 status-icon>

          <!--工单未派发和已派单的情况可以修改接单人-->
          <el-form-item label="接单人" prop="jid">
            <el-select v-model="modifyParams.jid" filterable clearable placeholder="请选择接单人"
                       :disabled="modifyParams.state !== 0 && modifyParams.state !== 1"
            >
              <el-option
                v-for="item of jdrData"
                :key="item.ybid"
                :label="item.xm"
                :value="item.ybid">
              </el-option>
            </el-select>
          </el-form-item>
          <!--未派单和维修中可以修改审核员1-->
          <el-form-item label="审核员1" prop="shy1">
            <el-select v-model="modifyParams.shy1" filterable clearable placeholder="请选择审核员1"
                       :disabled="modifyParams.state === 2 || modifyParams.state === 3"
            >
              <el-option
                v-for="item of shyData"
                :key="item.ybid"
                :label="item.xm"
                :value="item.ybid">
              </el-option>
            </el-select>
          </el-form-item>
          <!--未派单和维修中可以修改审核员2-->
          <el-form-item label="审核员2" prop="shy2">
            <el-select v-model="modifyParams.shy2" filterable clearable placeholder="请选择审核员2"
                       :disabled="modifyParams.state === 2 || modifyParams.state === 3"
            >
              <el-option
                v-for="item of shyData"
                :key="item.ybid"
                :label="item.xm"
                :value="item.ybid">
              </el-option>
            </el-select>
          </el-form-item>
          <!--工单状态为4（已验收）-->
          <el-form-item label="耗材使用" prop="hc">
            <el-input type="textarea" v-model="modifyParams.hc" :disabled="modifyParams.state !== 4 || modifyParams.state !== 2"></el-input>
          </el-form-item>
          <!--工单状态为2（已验收）-->
          <el-form-item label="维修工时" prop="gs">
            <el-input-number v-model="modifyParams.gs" :precision="2" :step="0.1" :min="0"
                             :disabled="modifyParams.state !== 4"></el-input-number>
          </el-form-item>
          <!--工单状态为4（已验收）才有评价，维修中和已撤回应该是没有评价的-->
          <el-form-item label="评价星级" prop="pjvalue">
            <el-rate
              v-model="modifyParams.pjvalue"
              :disabled="modifyParams.state !== 4 || modifyParams.state !== 2"
              show-text
              :max="evaluate.length"
              :texts="evaluate"
              text-color="#ff9900"
              style="margin-top: 10px;"
            >
            </el-rate>
          </el-form-item>
          <!--工单状态为4（已验收）才有评价，维修中和已撤回应该是没有评价的-->
          <el-form-item label="评价内容" prop="pjnr">
            <el-input type="textarea" v-model="modifyParams.pjnr" :disabled="modifyParams.state !== 4 "></el-input>
          </el-form-item>


        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleModify = false">取 消</el-button>
        <el-button type="primary" plain @click="onModifyOrderSubmit('modifyForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { AdminServlet } from '@/api/qygl'
  import { BxdServlet, getArea, getDeclare } from '@/api/bxd'
  import { getJdr, getChecker } from '@/api/jdr'
  import config from '@/config'
  import Pagination from '@/components/Pagination'
  import bxdDialog from '@/components/repairDetailDialog'
  import { copyObj, message, filterParams } from '@/utils/common'
  import { mapGetters } from 'vuex';

  export default {
    name: 'Repair', // 报修单
    components: { Pagination, bxdDialog },
    data() {
      return {
        switchAutoMonior: true, // 自动监控
        timer: null, // 定时器

        // 报修单参数
        params: {
          op: 'selbxdbyadminpc', // 调用方法*，固定值
          bid: null, // 报修单号，无则传递null，即不填参数即可，不传空字符串“”了，下同。不查询时不用传递任何信息。
          startime: null, // 日期查询开始时间 时间格式：yyyy-mm-dd
          endtime: null, // 日期查询结束时间 时间格式：yyyy-mm-dd
          xq: null, // 校区，下拉框，只有东城校区和临桂校区
          qid: null, // 区域id。区域，下拉框，只有“公共区”即教室自习室路灯等、“办公区”即机关单位办公室等、“生活区”即学生宿舍教职工公寓等
          jid: null, // 接单人id，下拉框为姓名，传递后台为id，列表见方法“四”。
          state: null, // 状态1~3，1已派单（成功申报，未维修），2已维修，3撤销单
          pj: null // 评价星级，1~5
        },
        modifyParams: {
          op: 'upbxdbyadmin', // 调用方法*，固定值
          bid: '',       // 报修单id*
          jid: '',       // 接单人易班id
          shy1: '',      // 审核员1易班id
          shy2: '',		 	 // 审核员2易班id
          pj: '',			   // 评价星级，只有公共区域能进行评价
          pjnr: '',      // 评价内容
          hc: '',        // 修改耗材使用
          gs: '',     	 // 修改工时
          del: ''        // 传递1则删除或者不传递。优先级最高，如果传递了，则直接删除该报修单
        },
        modifyRules: {
          // jid: {required: true, message: '必填项', trigger: ['blur', 'change']},
          // shy1: {required: true, message: '必填项', trigger: ['blur', 'change']},
          // shy2: {required: true, message: '必填项', trigger: ['blur', 'change']},
        },
        campus: config.campus, // 校区
        arealist: [],
        area: ['公共区', '办公区', '生活区'], // 区域
        states: [], // 接单人在职状态
        progress: config.progress, // 工单进度
        evaluate: config.evaluate, // 服务评价文字表述
        pjstar: [
          { label: '未评价', value: 0 },
          { label: '1星 ☆', value: 1 },
          { label: '2星 ☆☆', value: 2 },
          { label: '3星 ☆☆☆', value: 3 },
          { label: '4星 ☆☆☆☆', value: 4 },
          { label: '5星 ☆☆☆☆☆', value: 5 }
        ],
        format: 'YYYY-MM-DD HH:mm',
        pickerOptions0: this.setStarttimeRange(),
        pickerOptions1: this.setEndtimeRange(),
        paging: copyObj(config.paging), // 分页的信息
        loading: false, // 加载状态
        tableHeight: null, // 表格高度，获取内容高度
        tableData: [], // 处理后的表格数据
        jdrData: [], // 所有接单人数据
        jdrDataRadio: [], // 指派或修改接单人数据
        jdrId: null, // 选中接单人id
        shyData: [], // 审核员数据
        currJdrInfo: {
          id: null, // 接单人id
          xm: '', // 接单人姓名
          sj: '', // 接单人手机
          state: '' // 状态
        },
        bxdId: null, // 报修单id
        jdrSearchVal: '', // 搜索关键词
        dialogVisible: false, // 报修单详情弹框显隐
        jdrDialogVisible: false, // 接单人弹框显隐
        jdrDialogTitle: '', // 接单人弹框标题
        dialogVisibleModify: false, // 修改工单弹框
        qrcode: null, // 二维码插件对象
        bxdInfo: {} // 报修单详细信息
      }
    },
    mounted() {
      this.tableHeight = this.$refs['main-content'].offsetHeight
      this.states = config.states
      this.getBxdList()
      this.getShyList()
      this.getJdrList()
      this.autoMonitor()
    },
    computed: {
      ...mapGetters(['config']),
      jdrDatas() {
        const search = this.jdrSearchVal
        if (search) {
          return this.jdrData.filter(data => {
            return Object.keys(data).some(key => {
              // 查询关键字是姓名或手机号码
              if (key === 'xm' || key === 'sj') {
                return String(data[key]).toLowerCase().indexOf(search) > -1
              }
            })
          })
        }
        return this.jdrData
      }
    },
    methods: {
      /**
       * 自动监控，每隔n秒刷新一次数据
       */
      autoMonitor(){
        this.stopMonitor()
        if (this.switchAutoMonior && this.config.bxdtime) {
          this.timer = setInterval(this.queryData, this.config.bxdtime * 1000)
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
      handleMonitorSwitch () {
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
        // 获取数据
        this.getBxdList()
        // 获取申报中的报修单数量
        getDeclare()
      },
      /**
       * 获取报修单列表
       */
      getBxdList() {
        this.loading = true
        const params = filterParams(this.params)
        BxdServlet(params).then((response) => {
          this.loading = false
          this.tableData = this.handleDatas(response.obj.blist)
        }).catch(() => {
          this.loading = false
          this.tableData = []
        })
      },
      /**
       * 获取接单人列表
       */
      getJdrList() {
        getJdr().then(res => {
          if (res.obj.jlist) {
            this.jdrData = res.obj.jlist
          } else {
            message(res)
          }
        })
      },
      /**
       * 获取审核员列表
       */
      getShyList() {
        getChecker().then(res => {
          if (res.obj.slist) {
            this.shyData = res.obj.slist
          } else {
            message(res)
          }
        })
      },
      /**
       * 处理数据
       */
      handleDatas(data) {
        data.forEach(item => {
          item['bxtime'] = this.$moment(item['sbsj']).format(this.format)
          // console.log("itemTime: ", item['sbsj']);

          item['timestamp'] = this.$moment(item['sbsj']).format('YYYYMMDDHHmmss')
        })
        data.sort((a, b) => {
          return b['timestamp'] - a['timestamp']
        })
        return data
      },
      /**
       * 查看报修单详细信息
       * @param row
       */
      onViewDetail(row) {
        this.dialogVisible = true
        this.bxdInfo = row
      },
      /**
       * 修改报修单
       * @param row
       */
      onModifyOrder(row) {
        this.dialogVisibleModify = true
        this.modifyParams['bid'] = row.id
        this.modifyParams['jid'] = row.jid
        this.modifyParams['shy1'] = row.shy1
        this.modifyParams['shy2'] = row.shy2
        this.modifyParams['pjvalue'] = row.pj ? Number(row.pj) : 0
        this.modifyParams['pjnr'] = row.pjnr
        this.modifyParams['hc'] = row.hc
        this.modifyParams['gs'] = Number(row.gs)
        this.modifyParams['state'] = Number(row.state)
        // })
        // {
        //   op: 'upbxdbyadmin', // 调用方法*，固定值
        //     bid: '',       // 报修单id*
        //     jid: '',       // 接单人易班id
        //     shy1: '',      // 审核员1易班id
        //     shy2: '',		 	 // 审核员2易班id
        //     pj: '',			   // 评价星级，只有公共区域能进行评价
        //     pjnr: '',      // 评价内容
        //     hc: '',        // 修改耗材使用
        //     gs: '',     	 // 修改工时
        //     del: ''        // 传递1则删除或者不传递。优先级最高，如果传递了，则直接删除该报修单
        // },
      },
      /**
       * 修改报修单提交
       * @param formName
       */
      onModifyOrderSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.modifyParams.state !== 0 && this.modifyParams.state !== 1) {
              this.modifyParams['pj'] = this.modifyParams['pjvalue']
            }
            delete this.modifyParams['pjvalue']
            let params = filterParams(this.modifyParams)
            AdminServlet(params).then(res => {
              let status = message(res, '修改成功')
              if (status) {
                this.dialogVisibleModify = false
                this.getBxdList()
              }
            })
          }
        })
      },
      /**
       * 删除报修单
       * @param row
       */
      onDeleteOrder(row) {
        let params = this.resetParams(this.modifyParams)
        params['bid'] = row.id
        params['del'] = 1
        AdminServlet(filterParams(params)).then(res => {
          let status = message(res, '删除成功')
          if (status) {
            this.getBxdList()
          }
        })
      },
      /**
       * 指派接单人
       * @param index
       * @param row
       */
      async onAssignOrder(index, row) {
        this.jdrDialogVisible = true
        this.jdrDialogTitle = '指派接单人'
        this.bxdId = row.id // 报修单id
        this.jdrId = null // 清空上一次的选择
        this.currJdrInfo = {} // 清空当前接单人信息
      },
      /**
       * 修改接单人
       * @param index
       * @param row
       */
      async changeAssignOrder(index, row) {
        const me = this
        this.jdrDialogVisible = true
        this.jdrDialogTitle = '修改接单人'
        this.jdrId = row.jid // 接单人id
        this.bxdId = row.id // 报修单id
        this.currJdrInfo = {
          id: row.jid, // 接单人id，用于判断选择时是否与之前相同
          xm: row.j.xm, // 接单人名称
          sj: row.j.sj, // 接单人手机
          state: this.getState(me.states, row.j.state).text // 状态
        }
      },
      /**
       * 选择接单人
       * @param label
       */
      handleJdrSelect(label) {
        BxdServlet({
          op: 'upbxdforjdr', // 调用方法，固定值*
          bid: this.bxdId, // 报修单id*
          jid: this.jdrId // 指派接单人id*
        }).then(response => {
          this.$message.success('派单成功')
          this.jdrDialogVisible = false
          // 更新报修单列表
          this.getBxdList()
          // 更新申报单的数量
          this.$store.dispatch('bxd/getDeclare')
        }).catch(() => {
          this.$message.error('派单失败')
        })
      },
      /**
       * 设置搜索区域 时间选择器时间范围
       * @returns {*}
       */
      setStarttimeRange() {
        const me = this
        return {
          disabledDate(time) {
            const endtime = me.params.endtime
            if (endtime) { // 如果结束时间不为空，则开始时间最大值小于结束时间
              return new Date(endtime).getTime() <= time.getTime()
            } else {
              return time.getTime() > Date.now() // 结束时间不选时，开始时间最大值小于等于当天
            }
          }
        }
      },
      setEndtimeRange() {
        const me = this
        return {
          disabledDate(time) {
            const startime = me.params.startime
            if (startime) { // 如果开始时间不为空，则结束时间大于开始时间，小于当天时间
              return new Date(startime).getTime() - 8.64e7 > time.getTime() || time.getTime() > Date.now()
            } else {
              return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      handleSelectStarttime(value) {
        if (!this.params.endtime) {
          this.params.endtime = value
        }
      },
      handleSelectEdntime(value) {
        if (!this.params.startime) {
          this.params.startime = value
        }
      },
      /**
       * 搜索事件
       */
      handleSearch() {
        this.getBxdList()
      },
      handleSearchAll() {
        this.params = this.resetParams(this.params)
        this.getBxdList()
      },
      /**
       * 重置参数
       */
      resetParams(params) {
        let resultParams = {}
        for (const argumentsKey in params) {
          if (argumentsKey === 'op') {
            resultParams[argumentsKey] = params[argumentsKey]
          } else {
            resultParams[argumentsKey] = null
          }
        }
        return resultParams
        // this.params = {
        //   op: '', // 调用方法*，固定值
        //   bid: null, // 报修单号，无则传递null，即不填参数即可，不传空字符串“”了，下同。不查询时不用传递任何信息。
        //   startime: null, // 日期查询开始时间 时间格式：yyyy-mm-dd
        //   endtime: null, // 日期查询结束时间 时间格式：yyyy-mm-dd
        //   xq: null, // 校区，下拉框，只有东城校区和临桂校区
        //   qy: null, // 额外内容，暂无视。区域，下拉框，只有“公共区”即教室自习室路灯等、“办公区”即机关单位办公室等、“生活区”即学生宿舍教职工公寓等
        //   jdr: null, // 接单人id，下拉框为姓名，传递后台为id，列表见方法“四”。
        //   state: null, // 状态0~4，0申报中，1派单中，2维修中，3已维修，4撤销单
        //   pj: null, // 评价星级，1~5
        //   page: null // 页数，暂无视。当前查询第几页。
        // }
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
       * 根据状态值返回当前状态
       * @param state
       * @returns {*}
       */
      getState(datas, state) {
        const item = datas.filter(item => {
          return item.value == state
        })
        return item && item[0]
      },
      /**
       * 监听校区切换
       * @param val
       */
      handleCampusChange(val) {
        this.params.qid = '' // 切换校区，区域id置空
        const capItem = this.campus.filter(v => v.text === val)[0]
        getArea(capItem.value).then(res => {
          this.arealist = res.obj.qylist
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
  .left {
    text-align: left;
  }

  .jdr-select-dialog {
    .el-dialog {
      .el-dialog__body {
        padding: 0 0 0 79px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
        overflow: auto;

        .el-dialog-div {
          max-height: 55vh;
          margin-top: 30px;
          overflow: auto;

          .el-input-jdr {
            width: 245px;
            margin-bottom: 30px;

            input {
              border-radius: 30px;
            }
          }

          .el-tag-jdr {
            margin-left: 30px;
          }

          .el-radio {
            width: 230px;
            margin: 0 40px 20px 0;

            .sj {
              color: #8492a6;
              display: inline-block;
              margin-left: 10px;
            }
          }
        }
      }
    }
  }

  .dialog-body__modify {
    padding: 0 40px 0 20px;

    .el-select {
      width: 100%;
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100% !important;
  }
</style>
<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    &-header {
      width: 100%;
      padding: 15px 0;
      line-height: 50px;

      &-item {
        display: inline-block;
        margin-right: 10px;
      }
    }

    &-content {
      width: 100%;
      flex: 1;
      overflow-y: auto;
    }

    &-footer {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
    }
  }
</style>
