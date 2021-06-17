<template>
  <div class="main pad10">
    <div class="main-header">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addHc">新增耗材</el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="refreshHc('refresh')">刷新</el-button>
      <el-input
        v-model="searchVal"
        placeholder="查询：请输入耗材名称"
        prefix-icon="el-icon-search"
        class="el-input-hc"
        clearable
      ></el-input>
    </div>
    <div class="main-content" ref="main-content">
      <el-table
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
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mc"
          label="名称"
          align="center"
        >
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="xh"-->
<!--          label="型号"-->
<!--          align="center"-->
<!--        >-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="id"-->
<!--          label="编号"-->
<!--          align="center"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column
          prop="jg"
          label="单价"
          align="center"
          sortable
        >
        </el-table-column>
        <!--<el-table-column
          prop="kc"
          label="库存"
          align="center"
          sortable
        >
        </el-table-column>-->
        <el-table-column
          prop="dw"
          label="单位"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300">
          <template slot-scope="scope">
            <!--<el-button
              type="primary"
              size="small"
              plain
              @click="hcUsage(scope.$index, scope.row)">
              使用情况
            </el-button>
            <el-button
              type="success"
              size="small"
              plain
              @click="hcSupply(scope.$index, scope.row)"
            >
              补充
            </el-button>-->
            <el-button
                type="primary"
                size="small"
                plain
                @click="hcUpdate(scope.row)"
            >
              修改
            </el-button>

            <el-popconfirm
                title="确定删除吗？"
                @confirm="handleHcDelete"
            >
              <el-button
                  type="danger"
                  size="small"
                  plain
                  slot="reference"
                  @click="hcUDelete(scope.row)"
              >
                删除
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

    <!--添加耗材-->
    <el-dialog
      title="添加耗材"
      :visible.sync="dialogVisible"
      class="hc-add-dialog"
      width="560px"
      top="150px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <el-form :model="params" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
<!--          <el-form-item label="耗材类别" prop="lb">-->
<!--            <el-cascader-->
<!--              class="cascader-bxlb"-->
<!--              placeholder="选择耗材类别"-->
<!--              @change="hclbChange"-->
<!--              :options="options"-->
<!--              filterable-->
<!--              clearable-->
<!--            ></el-cascader>-->
<!--          </el-form-item>-->
          <el-form-item label="耗材类别" prop="lb">
            <el-cascader
              v-model="hclbval"
              class="cascader-bxlb"
              placeholder="选择耗材类别"
              :props="{ expandTrigger: 'hover' }"
              @change="hclbOptionChange"
              :options="hclbOptions"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="耗材名称" prop="mc">
            <el-input v-model="params.mc" id="addhcmc"></el-input>
<!--            <z-tree></z-tree>-->
          </el-form-item>
          <el-form-item label="单价(元)" prop="jg">
            <el-input v-model="params.jg"></el-input>
          </el-form-item>
          <!--<el-form-item label="库存数量" prop="kc">
            <el-input v-model="params.kc"></el-input>
          </el-form-item>-->
          <el-form-item label="单位" prop="dw">
            <el-input v-model="params.dw"></el-input>
          </el-form-item>
<!--          <el-form-item label="型号" prop="xh">-->
<!--            <el-input v-model="params.xh"></el-input>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="handleHcSubmit('insert', 'ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改耗材-->
    <el-dialog
        title="修改耗材"
        :visible.sync="dialogVisibleUpdate"
        class="hc-add-dialog"
        width="560px"
        top="150px"
        center
        append-to-body
    >
      <div class="el-dialog-div">
        <el-form :model="paramsUpdate" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
<!--          <el-form-item label="耗材类别" prop="lb">-->
<!--            <el-cascader-->
<!--              v-model="hclbval"-->
<!--              class="cascader-bxlb"-->
<!--              placeholder="选择耗材类别"-->
<!--              @change="hclbUpdate"-->
<!--              :options="options"-->
<!--              filterable-->
<!--              clearable-->
<!--            ></el-cascader>-->
<!--          </el-form-item>-->
          <el-form-item label="耗材类别" prop="lb">
            <el-cascader
              v-model="hclbval"
              class="cascader-bxlb"
              placeholder="选择耗材类别"
              :props="{ expandTrigger: 'hover' }"
              @change="hclbUpdateOptionChange"
              :options="hclbOptions"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="耗材名称" prop="mc">
            <el-input v-model="paramsUpdate.mc"></el-input>
          </el-form-item>
          <el-form-item label="单价(元)" prop="jg">
            <el-input v-model="paramsUpdate.jg"></el-input>
          </el-form-item>
          <!--<el-form-item label="库存数量" prop="kc">
            <el-input v-model="params.kc"></el-input>
          </el-form-item>-->
          <el-form-item label="单位" prop="dw">
            <el-input v-model="paramsUpdate.dw"></el-input>
          </el-form-item>
<!--          <el-form-item label="型号" prop="xh">-->
<!--            <el-input v-model="paramsUpdate.xh"></el-input>-->
<!--          </el-form-item>-->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" plain @click="handleHcSubmit('update', 'ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="耗材补给"
      :visible.sync="hcSupplyDialogVisible"
      class="hc-add-dialog"
      width="560px"
      top="150px"
      center
      append-to-body
    >
      <div class="el-dialog-div">
        <el-form :model="hcSupplyParams" :rules="hcSupplyRules" ref="hcRuleForm" label-position="left" label-width="100px">
          <el-form-item label="数量" prop="num">
            <el-input-number v-model="hcSupplyParams.num"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="hcSupplyDialogVisible = false">取 消</el-button>
        <el-button type="primary" plain @click="handleHcSubmit('add', 'hcRuleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="hcUsageDialogTitle"
      :visible.sync="hcUsageDialogVisible"
      class="hc-user-dialog"
      width="1000px"
      top="60px"
      center
      append-to-body
    >
      <div class="el-dialog-div" ref="el-dialog-div">
        <el-table
          ref="hcTable"
          :data="hcUsageData"
          :height="hcTableHeight"
          highlight-current-row
          :header-row-style="{ color: '#01AAED' }"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="bid"
            label="报修单号"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sj"
            label="使用时间"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              {{$moment(scope.row.sj).format(format)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="yt"
            label="用途"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.bid ? '使用' : '补充'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sl"
            label="数量"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.sl}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.bid"
                type="danger"
                size="small"
                plain
                @click="showBxd(scope.row.bid)"
              >
                查看报修单
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="hcUsageDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <bxd-dialog
      :visible.sync="bxdDialogVisible"
      :bxdInfo="bxdInfo"
    ></bxd-dialog>

  </div>
</template>

<script>
import {DictListServlet} from '@/api/Dict'
import { BxdServlet } from '@/api/bxd'
import { HcServlet } from '@/api/HcServlet'
import config from '@/config'
import Pagination from '@/components/Pagination' // 分页插件
import bxdDialog from '@/components/repairDetailDialog' // 报修单详细信息弹框
import { copyObj } from '@/utils/common'
// import ZTree from "../../../components/ztree/index";
export default {
  name: 'Material',
  components: { Pagination, bxdDialog },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('此项不能为空'))
      }
      const patrn = /^\d+(\.\d+)?$/
      if (!patrn.exec(value)) {
        callback(new Error('请输入有效数字值'))
      } else {
        callback()
      }
    }
    return {
      //耗材级别
      hclbOptions: [{
        value: '1',
        label: '安装 ',
        children: [{
          value: '1',
          label: '电气设备安装工程-通用'
        }, {
          value: '2',
          label: '电气设备安装工程-明装'
        }, {
          value: '3',
          label: '电气设备安装工程-暗装'
        }, {
          value: '4',
          label: '给排水、燃气工程'
        }]
      },{
        value: '2',
        label: '安装拆除 ',
        children: [{
          value: '1',
          label: '变配电及低压电器拆除'
        }, {
          value: '2',
          label: '给排水、燃气工程拆除'
        }, {
          value: '3',
          label: '消防工程拆除'
        }]
      },{
        value: '3',
        label: '拆除 ',
        children: [{
          value: '1',
          label: '人工拆除工程'
        }, {
          value: '2',
          label: '机械拆除工程'
        }]},{
        value: '4',
        label: '建筑',
        children: [{
          value: '1',
          label: '土（石）方工程'
        }, {
          value: '2',
          label: '砌筑工程'
        }, {
          value: '3',
          label: '屋面及防水工程'
        }, {
          value: '4',
          label: '保温、隔热、防腐工程'
        }, {
          value: '5',
          label: '垃圾外运'
        }, {
          value: '6',
          label: '脚手架工程'
        }, {
          value: '7',
          label: '混凝土模板及支架(撑)'
        }, {
          value: '8',
          label: '特殊项目及机械台班'
        }]
      },{
        value: '5',
        label: '市政',
        children: [{
          value: '1',
          label: '市政'
        }, {
          value: '2',
          label: '楼地面工程'
        }, {
          value: '3',
          label: '墙、柱面工程'
        }, {
          value: '4',
          label: '天棚工程'
        }, {
          value: '5',
          label: '油漆、涂料、裱糊工程'
        }, {
          value: '6',
          label: '其他装饰工程'
        }, {
          value: '7',
          label: '门窗工程'
        }, {
          value: '8',
          label: '玻璃价格调差'
        }]
      }],
      hclbval:[],//耗材类别
      options: [],
      loading: false, // 表格数据加载状态
      tableHeight: null, // 表格高度
      addhc:[],  //添加耗材数据
      hcData: [], // 耗材数据
      hcUsageData: [], // 耗材使用情况表格数据
      searchVal: '', // 查询关键词
      format: 'YYYY-MM-DD HH:mm', // 时间格式
      paging: copyObj(config.paging), // 分页的信息
      dialogVisible: false, // 添加耗材弹窗
      dialogVisibleUpdate: false,  // 修改耗材弹框
      hcUsageDialogVisible: false, // 耗材使用情况弹窗
      hcUsageDialogTitle: '',
      hcSupplyDialogVisible: false, // 耗材补给弹窗
      bxdDialogVisible: false, // 点击使用情况弹框 -> 点击查看当前报修单详情弹窗
      bxdInfo: {}, // 点击使用情况弹框 -> 点击查看当前报修单详情
      hcTableHeight: null, // 耗材使用情况表格高度
      params: { // 参数
        lb:'',//耗材类别
        xh:'',//耗材型号
        op: 'newhc', // 固定参数
        mc: '', // 名称
        jg: null, // 价格（前台判断，必须是数字，可以是浮点数）
        // kc: null, // 库存（前台判断，必须是数字，可以是浮点数）
        dw: '' // 单位
      },
      paramsUpdate: { // 参数
        lb:'',//耗材类别
        xh:'',//耗材型号
        op: 'uphc', // 固定参数
        id: '',
        mc: '', // 名称
        jg: null, // 价格（前台判断，必须是数字，可以是浮点数）
        dw: '' // 单位
      },
      paramsDelete: { // 参数
        op: 'delhc', // 固定参数
        id: ''
      },
      rules: {
        lb: { required: true, message: '请选择耗材类别', trigger: ['blur', 'change'] },
        mc: { required: true, message: '请填写名称', trigger: ['blur', 'change'] },
        jg: [
          { required: true, message: '请填写单价', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: 'blur' }
        ],
        kc: [
          { required: true, message: '请填写库存数量', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: 'blur' }
        ],
        dw: [
          { required: true, message: '请填写单位', trigger: ['blur', 'change'] }
        ]
      },
      hcSupplyParams: {
        op: 'uphcforkc',
        hid: null, // 耗材id*
        num: null // 补充的数量*，不是加上库存的数量（可以是负数，可以是浮点数）
      },
      hcSupplyRules: {
        num: [
          { required: true, message: '请填写补充数量', trigger: ['blur', 'change'] },
          { validator: (rule, value, callback) => {
            if (value === 0) {
              callback(new Error('补充数量不能为0'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    total() {
      return this.tableData.length
    },
    tableData() {
      const search = this.searchVal
      if (search) {
        return this.hcData.filter(data => {
          return Object.keys(data).some(key => {
            if (key === 'mc') { // 只查询名称
              return String(data[key]).toLowerCase().indexOf(search) > -1
            }
          })
        })
      }
      return this.hcData
    }
  },
  mounted() {
    this.tableHeight = this.$refs['main-content'].offsetHeight
    this.getHcList()
    // this.initDict();
  },
  methods: {
    //初始化耗材类别
    // initDict(){
    //   DictListServlet().then(response => {
    //     this.options = response.obj;
    //   }).catch(() => {
    //     this.$message.error('查询耗材类别出错')
    //   })
    // },
    /**
     * 获取耗材级联选择数据
     */
    hclbOptionChange(currentVal){
      if (currentVal.length !== 0){
        //耗材类别第一级
        this.params.lb = currentVal[0];
        // 耗材类别第二级
        this.params.xh = currentVal[1];
      }
    },
    //耗材 类别修改
    hclbUpdateOptionChange(currentVal){
      if (currentVal.length !== 0){
        //耗材类别第一级
        this.paramsUpdate.lb = currentVal[0];
        // 耗材类别第二级
        this.paramsUpdate.xh = currentVal[1];
      }
    },
    //添加耗材
    hclbChange(currentVal){
      if (currentVal.length == 0) {
        this.params.lb = '';
      } else {
        // this.params.lb = currentVal[0]+'-'+currentVal[1];
        //耗材类别第一级
        this.params.lb = currentVal[0];
        // 耗材类别第二级
        this.params.xh = currentVal[1];
      }
    },
    //修改耗材
    hclbUpdate(currentVal){
      if (currentVal.length == 0) {
        this.paramsUpdate.lb = '';
      } else {
        this.paramsUpdate.lb = currentVal[0]+'-'+currentVal[1];
      }
    },
    /**
     * 获取耗材
     */
    getHcList(refresh) {
      this.loading = true
      HcServlet({ op: 'selhc' }).then(response => {
        this.loading = false
        this.hcData = response.obj.hlist
        if (refresh) {
          this.$message.success('刷新成功')
        }
      }).catch(() => {
        this.loading = false
        this.hcData = []
        this.$message.error('接单人获取失败，请检查接口')
      })
    },
    /**
     * 添加耗材
     */
    addHc() {
      this.dialogVisible = true
      this.resetForm('ruleForm')
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo")
      var node = treeObj.getNodes()
      var nodes = treeObj.transformToArray(node)
      this.addhc=nodes
    },
    /**
     * 确定添加，传递后台
     */
    handleHcSubmit(type, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 'insert') {
            this.handleHcInsert()
          } else if (type === 'add') {
            this.handleHcAdd()
          } else if(type === 'update') {
            this.handleHcUpdate()
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    /**
     * 刷新表格，重新获取数据
     */
    refreshHc(refresh) {
      if (refresh) {
        this.searchVal = ''
      }
      this.getHcList(refresh)
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
     * 耗材使用情况
     * @param index
     * @param row
     */
    hcUsage(index, row) {
      this.hcUsageDialogVisible = true
      this.hcUsageDialogTitle = row.mc ? `【${row.mc}】使用情况` : '耗材使用情况'
      this.hcUsageData = row.sylist
      this.$nextTick(() => {
        if (this.$refs['el-dialog-div']) {
          this.hcTableHeight = this.$refs['el-dialog-div'].offsetHeight
        }
      })
    },
    /**
     * 耗材补给
     * @param row
     */
    hcSupply(row) {
      this.hcSupplyDialogVisible = true
      this.hcSupplyParams.hid = row.id
      this.resetForm('hcRuleForm')
    },
    hcUpdate(row) {
      this.dialogVisibleUpdate = true
      this.paramsUpdate.id = row.id
      this.paramsUpdate.mc = row.mc
      this.paramsUpdate.jg = row.jg
      this.paramsUpdate.dw = row.dw
      this.paramsUpdate.xh = row.xh
      this.paramsUpdate.lb = row.lb
      // this.hclbval = this.paramsUpdate.lb.split('-')
      //回显耗材类别
      let hclbArr = [row.lb,row.xh]
      this.hclbval = hclbArr;
    },
    hcUDelete(row) {
      this.paramsDelete.id = row.id
      console.log('delete222============')
      console.log(this.paramsDelete)
    },
    /**
     * 新增耗材，传递后台
     */
    handleHcInsert() {
      this.dialogVisible = false
      HcServlet(this.params).then(() => {
        this.$message.success('添加成功')
        this.refreshHc()
      }).catch(() => {
        this.$message.error('添加失败，请重试')
      })
    },
    /**
     * 添加耗材数量，传递后台
     */
    handleHcAdd() {
      this.hcSupplyDialogVisible = false
      this.searchVal = ''
      HcServlet(this.hcSupplyParams).then(() => {
        this.$message.success('添加成功')
        this.hcSupplyParams.hid = null
        this.hcSupplyParams.num = null
        this.refreshHc()
      }).catch(() => {
        this.$message.error('添加失败，请重试')
      })
    },
    /**
     * 耗材修改
     */
    handleHcUpdate() {
      this.dialogVisibleUpdate = false
      HcServlet(this.paramsUpdate).then(() => {
        this.$message.success('修改成功')
        this.refreshHc()
      }).catch(() => {
        this.$message.error('修改失败，请重试')
      })
    },
    /**
     * 删除耗材
     */
    handleHcDelete() {
      console.log('delete============')
      console.log(this.paramsDelete)
      HcServlet(this.paramsDelete).then(() => {
        this.$message.success('删除成功')
        this.refreshHc()
      }).catch(() => {
        this.$message.error('删除失败，请重试')
      })
    },

    showBxd(bxdId) {
      this.getBxdInfo(bxdId)
    },
    getBxdInfo(id) {
      const loading = this.$loading({
        lock: true,
        text: '正在获取报修单',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)',
        customClass: 'bxd-loading'
      })
      BxdServlet({
        op: 'bxlist',
        bid: id
      }).then(response => {
        loading.close()
        this.bxdDialogVisible = true
        this.bxdInfo = response.blist[0]
      }).catch(() => {
        loading.close()
        this.$message.warning('报修单获取失败，请重新')
      })
    }
  },
  watch: {
    addhc: {
      handler: function(newVal, oldVal) {
        var newName=""
        for(var i=0;i<newVal.length;i++){
          newName=newName+"/"+newVal[i].name
        }

        this.params.mc=newName

        console.log(newName);
      },
      deep: true,
    }
  }
}
</script>
<style lang="scss">
  .hc-add-dialog {
    .el-dialog {
      .el-dialog__body {
        padding: 40px 100px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        .el-dialog-div {
          .el-form-item {
            .el-form-item__label {
              padding: 0;
            }
            .el-input-number {
              width: 230px;
            }
          }
        }
      }
    }
  }

  .hc-user-dialog {
    .el-dialog {
      .el-dialog__body {
        height: 72vh;
        padding: 20px;
        box-sizing: border-box;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        .el-dialog-div {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }

  .el-input-hc {
    input {
      border-radius: 30px;
    }
  }
  .bxd-loading {
    z-index: 99999!important;
  }
</style>
<style lang="scss" scoped>
  .cascader-bxlb{
    width: 100%;
  }
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
      .el-input-hc {
        width: 270px;
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
