<template>
  <div class="main pad10">
    <div class="main-header" ref="mainHeader">
      <span class="title">校区</span>
      <el-select v-model="xq" clearable placeholder="请选择校区" :disabled="showType === 'qrcode'"
                 @change="handleCampusChange">
        <el-option
            v-for="item in campus"
            :key="item.value"
            :label="item.text"
            :value="item.value">
        </el-option>
      </el-select>
      <template v-if="showType === 'img' || showType === 'qrcode'">
        <span class="title">区域</span>
        <el-select popper-class="main-header-select" v-model="qy" clearable filterable placeholder="请选择区域">
          <el-option
              v-for="(item, index) in region"
              :key="index"
              :label="item.qy"
              :value="item.id">
          </el-option>
        </el-select>
      </template>
      <el-button v-if="showType === 'img' || showType === 'qrcode'" type="primary" icon="el-icon-search"
                 @click="getQrcode(qy)">查看二维码
      </el-button>
      <el-button v-if="showType === 'img'" type="success" icon="el-icon-search" @click="showAreaList">查看所有区域列表
      </el-button>
      <el-switch v-if="showType === 'img'" v-model="switchAutoMonior" active-text="自动监控" style="margin: 0 10px;"
                 @change="handleMonitorSwitch"></el-switch>
      <span v-if="showType === 'img' && switchAutoMonior" style="font-size: 14px; color: #9e9e9e;">({{config.qygltime}}s自动刷新)</span>
      <el-button v-if="showType === 'qrcode'" type="success" icon="el-icon-plus" @click="addQrcode">新建二维码</el-button>
      <el-button v-if="showType === 'qrcode' || showType === 'area'" class="fr" type="primary" plain icon="el-icon-back"
                 @click="handleBack">返回
      </el-button>
    </div>

    <div class="main-content" ref="mainContent" @mousewheel="onMousewheel($event)" style="height: 100%">
      <div style="position: relative;width: 100%;height: 100%;">
        <div class="image-tips">
          <!--<el-tag type="primary" style="margin-left: 15px;">-->
          <el-tag type="primary">
            *提示：图片区域范围内鼠标右键新建区域
          </el-tag>
        </div>
        <!--重置视图按钮-->
        <div class="image-recovery">
          <el-button type="danger" round size="small" icon="el-icon-refresh" @click="resetImageView">重置视图</el-button>
        </div>
        <!--遮罩层开关按钮-->
        <div class="image-mask" @mousedown="onMouseDown" @mouseup="onMouseUp">
          <el-button type="primary" round size="small" icon="el-icon-view">遮罩</el-button>
        </div>
        <div class="image-wrapper" ref="imageWrapper">
          <el-image
              :key="campusImage"
              style="width: 100%; height: 100%;"
              :src="campusImage"
              fit="scale-down"></el-image>
        </div>
<!--        <div class="image-mark-copy" ref="imageMarkCopy"></div>-->
        <div class="image-mark" ref="imageMark" @contextmenu="onContextmenu">
          <div
            v-for="(item, index) in regionMap"
            :key="index"
            class="mark-item"
            :style="{ left: item.x + 'px', top: item.y + 'px'}">
            <el-popover
              placement="top"
              trigger="manual"
              v-model="item.visible">
              <el-table
                :data="item.b"
                max-height="300"
                size="medium"
                :header-cell-style="{ padding: 0 }"
                :cell-style="{ padding: '3px 0', lineHeight: '12px' }"
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="报修单号"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="xxdd"
                  label="地址"
                  min-width="150"
                  align="center">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="50"
                  align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleOpenDetail(scope.row)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div slot="reference" @click="item.visible = !item.visible">
                <!--<p class="marker">{{item.countb}}</p>
                <p class="name">{{item.qy}}</p>-->
                <p class="marker">
                  <span class="name">{{item.qy}}</span>
                  <span v-if="item.countb" class="count">{{item.countb}}</span>
                </p>
              </div>
              <div style="text-align: right; margin-top: 5px;">
                <el-button type="primary" size="mini" @click="viewQrcode(item)">查看二维码</el-button>
                <el-button type="danger" size="mini" @click="updateRegion(item)">修改区域信息</el-button>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div v-if="showType === 'qrcode'" class="qrcode-content">
        <el-table
            :key="tableKey"
            :data="tableData"
            :height="tableHeight"
            border
            :row-style="{ height: '106px' }"
            style="width: 100%">
          <el-table-column
              prop="qid"
              label="二维码"
              align="center">
            <template slot-scope="{ row }">
              <svg class="qrcode" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                   @click="handleQrcodeZoomIn(row)">
                <g :id="row.qrcodeid"/>
              </svg>
              <!--            <div v-if="row.qrcodeid" class="qrcode" :id="row.qrcodeid"></svg>-->
            </template>
          </el-table-column>
          <el-table-column
              prop="qrcodeurl"
              label="二维码链接"
              align="center">
          </el-table-column>
          <el-table-column
              prop="xxdd"
              label="二维码地址"
              align="center">
          </el-table-column>
          <el-table-column
              label="操作"
              width="300"
              align="center">
            <template slot-scope="scope">
              <el-button @click="handleQrcodeEdit(scope.row)" type="primary" plain size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else-if="showType === 'area'" class="qrcode-content">
        <el-table
            :key="tableKey"
            :data="region"
            :height="tableHeight"
            border
            style="width: 100%">
          <el-table-column
              prop="xq"
              label="校区"
              align="center">
          </el-table-column>
          <el-table-column
              prop="qylb"
              label="区域类别"
              align="center"
              :filters="filters"
              :filter-method="filterQylb"
          >
          </el-table-column>
          <el-table-column
              prop="qy"
              label="区域名称"
              align="center">
          </el-table-column>
          <el-table-column
              prop="countb"
              label="当前申报单数量"
              align="center">
          </el-table-column>
          <el-table-column
              label="操作"
              width="300"
              align="center">
            <template slot-scope="{ row }">
              <el-button @click="viewQrcode(row)" type="primary" plain size="small">查看二维码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="showType === 'qrcode'" class="main-footer">
      <pagination
          :total="qrcode.length"
          :paging="paging"
          @pagination="handleSizeChange">
      </pagination>
    </div>

    <vue-context-menu
        class="context-menu"
        v-if="showType === 'img'"
        :target="$refs.imageMark"
        :show="contextMenuVisible"
        @update:show="(show) => contextMenuVisible = show">
      <a @click="addRegion">新建区域</a>
    </vue-context-menu>

    <!--新增区域-->
    <el-dialog
        title="新建区域"
        :visible.sync="dialogVisibleAdd"
        class="jdr-add-dialog"
        width="450px"
        center
        :modal="true"
        :close-on-click-modal="false"
        append-to-body
    >
      <div>
        <el-form :model="params" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" status-icon>
          <el-form-item label="区域名称" prop="qy">
            <el-input v-model="params.qy" placeholder="请填写区域名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="区域类别" prop="qylb">
            <el-select v-model="params.qylb" clearable placeholder="请选择区域类别">
              <el-option
                  v-for="(item, index) in qylb"
                  :key="index"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域位置">
            <span v-if="params.x && params.y" style="margin-left: 2px;">x: {{params.x}},  y: {{params.y}}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" plain @click="addRegionSubmit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改区域-->
    <el-dialog
        title="修改区域"
        :visible.sync="dialogVisibleUpdate"
        class="jdr-add-dialog"
        width="450px"
        center
        :modal="false"
        append-to-body
        :close-on-click-modal="false"
    >
      <div>
        <el-form :model="updateParams" :rules="rules" ref="ruleForm1" label-position="center" label-width="100px"
                 status-icon>
          <el-form-item label="区域名称" prop="qy">
            <el-input v-model="updateParams.qy" placeholder="请填写区域名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="区域类别" prop="qylb">
            <el-select v-model="updateParams.qylb" clearable placeholder="请选择区域类别">
              <el-option
                  v-for="(item, index) in qylb"
                  :key="index"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域位置" prop="qywz">
            <div>
              <span v-if="updateParams.x && updateParams.y" style="margin-left: 2px;">x: {{updateParams.x}},  y: {{updateParams.y}}</span>
              <el-button type="text" style="color: #f00; margin-left: 10px;"
                         @click="showRegionUpdateDialog(updateParams)">点我选择位置
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" plain @click="updateRegionSubmit('ruleForm1')">确 定</el-button>
      </span>
    </el-dialog>

    <!--订正位置-->
    <el-dialog
        :title="dialogVisiblePosiTitle"
        :visible.sync="dialogVisiblePosi"
        class="dialog-posi"
        width="1300px"
        top="50px"
        center
        append-to-body
        :close-on-click-modal="false"
        style="z-index: 10001"
    >
      <div class="el-dialog-div">
        <image-scale :img="campusImage" :markPosi="markPosi" @change="setMarkPosi"></image-scale>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisiblePosi = false">取 消</el-button>
        <el-button type="primary" plain @click="setMarkPosiToParams(markPosi)">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增二维码-->
    <el-dialog
        title="新增二维码"
        :visible.sync="dialogVisibleQrcodeAdd"
        class="add-dialog"
        width="450px"
        center
        :modal="false"
        append-to-body
        :close-on-click-modal="false"
    >
      <div>
        <el-form :model="addQrcodeParams" :rules="qrcodeRules" ref="addQrcodeForm" label-position="top"
                 label-width="100px" status-icon>
          <el-form-item label="校区:">
            <el-input v-model="xqText" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前区域:">
            <el-input v-model="qyText" disabled></el-input>
          </el-form-item>
          <el-form-item label="二维码张贴地址:" prop="xxdd">
            <el-input type="textarea" v-model="addQrcodeParams.xxdd" :rows="3" placeholder="请填写二维码张贴地址"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleQrcodeAdd = false">取 消</el-button>
        <el-button type="primary" plain @click="addQrcodeSubmit('addQrcodeForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改二维码-->
    <el-dialog
        title="修改二维码"
        :visible.sync="dialogVisibleQrcodeUpdate"
        class="add-dialog"
        width="450px"
        center
        :modal="false"
        append-to-body
        :close-on-click-modal="false"
    >
      <div>
        <el-form :model="updateQrcodeParams" :rules="qrcodeRules" ref="updateQrcodeForm" label-position="top"
                 label-width="100px" status-icon>
          <el-form-item label="校区:">
            <el-input v-model="xqText" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前区域:">
            <el-input v-model="qyText" disabled></el-input>
          </el-form-item>
          <el-form-item label="二维码张贴地址" prop="xxdd">
            <el-input type="textarea" v-model="updateQrcodeParams.xxdd" :rows="3" placeholder="请填写二维码张贴地址"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleQrcodeUpdate = false">取 消</el-button>
        <el-button type="primary" plain @click="updateQrcodeSubmit('updateQrcodeForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--二维码预览-->
    <el-dialog
        title="二维码预览"
        :visible.sync="dialogVisibleQrcodeZoomIn"
        class="preview-dialog"
        width="400px"
        :modal="false"
        center
    >
      <div class="xxdd">地址：{{qrcodeXxdd}}</div>
      <div class="qrcodeZoomIn" id="qrcodeZoomIn"></div>
    </el-dialog>

    <!--报修单详情-->
    <bxd-dialog
        :visible.sync="dialogVisibleBxd"
        :bxdInfo="bxdInfo"
    ></bxd-dialog>

  </div>
</template>

<script>
  import { AdminServlet, getRegion, getBxdDetail } from '@/api/qygl'
  import { getDeclare } from '@/api/bxd';
  import { copyObj, message } from '@/utils/common'
  import QRCode from 'qrcodejs2' // 二维码插件
  import config from '@/config/index'
  import BxdDialog from '@/components/repairDetailDialog'
  import ImageScale from '@/components/ImageScale'
  import Pagination from '@/components/Pagination'
  import { component as VueContextMenu } from '@xunlei/vue-context-menu'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Region', // 区域管理
    components: {
      'vue-context-menu': VueContextMenu,
      BxdDialog,
      ImageScale,
      Pagination
    },
    directives: {
      // 注册一个局部的自定义指令 v-focus
      drag: {
        bind: function (el, binding) {
          let oDiv = el; //当前元素
          oDiv.onmousedown = function (e) {
            //鼠标按下，计算当前元素距离可视区的距离
            let disX = e.clientX - oDiv.offsetLeft;
            let disY = e.clientY - oDiv.offsetTop;
            document.onmousemove = function (e) {
              //通过事件委托，计算移动的距离
              let l = e.clientX - disX;
              let t = e.clientY - disY;
              //移动当前元素
              oDiv.style.left = l + 'px';
              oDiv.style.top = t + 'px';
            };
            document.onmouseup = function (e) {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      }
    },
    data() {
      return {
        switchAutoMonior: false, // 自动监控
        timer: null, // 定时器

        campus: config.campus, // 校区
        region: [], // 区域
        regionMap: [], // 地图上的区域，需要过滤掉blist=0的区域
        qrcode: [], // 二维码
        xq: 0, // 默认临桂校区
        qy: '',
        showType: '', // img/qrcode/area
        views: [],
        tableKey: '',
        tableHeight: null,
        qylb: config.area, // 区域类别
        paging: copyObj(config.paging), // 分页的信息
        contextMenuVisible: false,
        dialogVisibleAdd: false,
        dialogVisibleUpdate: false,
        dialogVisiblePosi: false,
        dialogVisiblePosiTitle: '',
        dialogVisibleQrcodeAdd: false,
        dialogVisibleQrcodeUpdate: false,
        dialogVisibleQrcodeZoomIn: false, // 二维码预览
        dialogVisibleBxd: false, // 报修单弹框
        qrcodeZoomIn: '',
        qrcodeXxdd: '',
        bxdInfo: null, // 报修单详情
        imageMaskValue: false, // 遮罩层
        // 新增区域参数
        params: {
          op: 'newqy', // 调用方法*，固定值
          qy: '', // 区域名称*
          qylb: '', // 区域类别*
          xq: '', // 所在校区（临桂0，东城1）*
          x: '', // 图片上x坐标*
          y: '' // 图片上y坐标*
        },
        // 修改区域参数
        updateParams: {
          op: 'upqy', // 调用方法*，固定值
          qid: '', // 区域id*
          qy: '', // 区域名称*
          qylb: '', // 区域类别*
          xq: '', // 所在校区（临桂0，东城1）*
          x: '', // 图片上x坐标*
          y: '' // 图片上y坐标*
        },
        // 二维码参数
        qrcodeParams: {
          op: 'selewm', // 调用方法*，固定值
          qid: '' // 区域id
        },
        // 新增二维码参数
        addQrcodeParams: {
          op: 'newewm', // 调用方法*，固定值
          qid: '', // 区域id*
          xxdd: '' // 二维码张贴地点*
        },
        // 修改二维码参数
        updateQrcodeParams: {
          op: 'upewm', // 调用方法*，固定值
          eid: '', // 二维码id*
          qid: '', // 区域id
          xxdd: '' // 二维码张贴地点
        },
        rules: {
          qy: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          qylb: { required: true, message: '必填项', trigger: ['blur', 'change'] }
        },
        qrcodeRules: {
          xxdd: { required: true, message: '必填项', trigger: ['blur', 'change'] },
          qid: { required: true, message: '必填项', trigger: ['blur', 'change'] }
        },
        markPosi: {
          x: '',
          y: ''
        }
      }
    },
    computed: {
      ...mapGetters(['config']),
      campusImage() {
        return process.env.BASE_URL + 'static/image/campus_' + this.params.xq + '.jpg';
        // return 'http://localhost:8090/static/image/campus_ '+ this.params.xq +'.jpg'
      },
      xqText() {
        let v = this.campus.filter(v => v.value === this.xq)[0]
        return v && v.text
      },
      qyText() {
        let v = this.region.filter(v => v.id === this.qy)[0]
        return v && v.qy
      },
      tableData() {
        let paging = this.paging
        return this.qrcode.slice((paging.currentPage - 1) * paging.pagesize, paging.currentPage * paging.pagesize)
      },
      filters() {
        return config.area.map(v => {
          return { text: v, value: v }
        })
      }
    },
    async mounted() {
      this.showType = 'img'
      this.cacheViews()
      this.queryData()
      this.showType === 'img' && this.onDrag()
      this.setMainContentWidth()
      this.autoMonitor()
    },
    activated() {
      this.autoMonitor()
    },
    methods: {
      /**
       * 自动监控，每隔n秒刷新一次数据
       */
      autoMonitor() {
        this.stopMonitor()
        if (this.switchAutoMonior) {
          this.timer = setInterval(this.queryData, this.config.qygltime * 1000)
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
        // 获取区域数据
        this.getRegion(this.xq)
        // 获取申报中的报修单数量
        getDeclare()
      },
      /**
       * 过滤参数，空值的不传递，0传递
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
      /**
       * 根据图片的宽高比例和自身高度设置宽度
       * 图片 2621:1508
       */
      setMainContentWidth() {
        // let height = this.$refs.mainContent.offsetHeight
        // let width = (2621 / 1508) * height
        // this.$refs.mainHeader.style.width = width + 'px'
        // this.$refs.mainContent.style.width = width + 'px'

        this.$refs.mainContent.style.width = this.config.mapwidth
        this.$refs.mainContent.style.height = this.config.mapheight
      },
      /**
       * 获取区域
       * @param xq
       */
      getRegion(xq) {
        this.params.xq = xq
        getRegion(xq).then(res => {
          /*res = {
            "qylist": [{
              "b": [],
              "countb": 2,
              "ewm": [],
              "id": 1,
              "qy": "1",
              "qylb": "1",
              "x": "730",
              "xq": "临桂校区",
              "y": "530"
            }, {
              "b": [],
              "countb": 89,
              "ewm": [],
              "id": 2,
              "qy": "办公楼",
              "qylb": "办公区",
              "x": "833",
              "xq": "临桂校区",
              "y": "388"
            }, {
              "b": [],
              "countb": 6,
              "ewm": [],
              "id": 3,
              "qy": "11",
              "qylb": "22",
              "x": "547",
              "xq": "临桂校区",
              "y": "557"
            }]
          }*/
          if (res.obj.qylist) {
            this.region = res.obj.qylist.map(v => {
              v.visible = false
              return v
            })
            this.regionMap = this.region.filter(v => {

              // v.x = 450
              // v.y = 250
              // v.qy = '1号宿舍'
              // v.b.forEach(k => k.xxdd = '1号宿舍25栋5楼303房')

              // return v && v.countb
              return v && v.countb
            })
          } else {
            this.$message.error('区域接口异常')
          }
        })
      },
      /**
       * 新建区域
       */
      addRegion() {
        this.contextMenuVisible = false
        this.dialogVisibleAdd = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].resetFields()
        })
      },
      /**
       * 新建区域提交
       * @param form
       */
      addRegionSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            AdminServlet(this.params).then(res => {
              message(res, '新建成功')
              this.dialogVisibleAdd = false
              this.getRegion(this.xq)
            })
          }
        })
      },
      /**
       * 修改区域
       * @param item
       */
      updateRegion(item) {
        item.visible = false
        this.dialogVisibleUpdate = true
        this.updateParams = {
          op: 'upqy', // 调用方法*，固定值
          qid: item.id, // 区域id*
          qy: item.qy, // 区域名称*
          qylb: item.qylb, // 区域类别*
          xq: item.xq, // 所在校区（临桂0，东城1）*
          x: item.x, // 图片上x坐标*
          y: item.y // 图片上y坐标*
        }
      },
      /**
       * 修改区域提交
       * @param form
       */
      updateRegionSubmit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.updateParams.xq = this.xq
            AdminServlet(this.updateParams).then(res => {
              let ret = message(res, '修改成功')
              if (ret) {
                this.dialogVisibleUpdate = false
                this.getRegion(this.xq)
              }
            })
          }
        })
      },
      /**
       * 查看二维码
       * @param item
       */
      viewQrcode(item) {
        this.qy = item.id
        this.getQrcode(this.qy)
      },
      /**
       * 校区切换
       * @param val
       */
      handleCampusChange(val) {
        this.getRegion(val)
      },
      /**
       * 返回按钮
       */
      handleBack() {
        this.removeViews()

        this.$nextTick(() => {
          this.tableKey = +new Date() // 表格重新渲染
        })

        // this.showType = 'img'
        // this.$nextTick(() => {
        //   this.setMainContentWidth()
        //   this.onDrag()
        // })
      },
      /**
       * 监听鼠标滚轮，div放大缩小
       * @param ev
       */
      onMousewheel(ev) {
        // img模式下可用
        if (this.showType === 'img') {
          // 隐藏弹框
          this.hideBxdlistPopover()
          /* 获取当前页面的缩放比
             若未设置zoom缩放比，则为默认100%，即1，原图大小
         */
          let dom1 = this.$refs.imageMark
          let dom11 = this.$refs.imageMarkCopy
          let dom2 = this.$refs.imageWrapper
          let transform = getComputedStyle(dom1).transform
          let scale = parseFloat(transform.substring(7).split(','))
          let zoom = scale || 1;

          /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
                wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
            */
          zoom += ev.wheelDelta / 500

          console.log(zoom.toFixed(0))
          /* 最小范围的图片缩放尺，不限制最大范围 */
          if (zoom >= .5) {
            dom1.style.transform = 'scale(' + zoom + ')'
            dom2.style.transform = 'scale(' + zoom + ')'

            this.$nextTick(() => {
              let style = getComputedStyle(dom1)
              console.log(style.width, style.height, style.zoom)
            })
            // this.regionMap.map(v => {
            //   v.x *= zoom
            //   v.y *= zoom
            // })
          }
        }
      },
      /**
       * 监听div位置变化
       */
      onDrag() {
        let self = this
        let oDiv = this.$refs.imageMark
        let oDiv1 = this.$refs.imageWrapper
        oDiv.onmousedown = function (e) {
          //鼠标按下，计算当前元素距离可视区的距离
          let disX = e.clientX - oDiv.offsetLeft;
          let disY = e.clientY - oDiv.offsetTop;
          self.hideBxdlistPopover()
          document.onmousemove = function (e) {
            //通过事件委托，计算移动的距离
            let x = e.clientX - disX;
            let y = e.clientY - disY;
            // 防止越界
            let width = oDiv.getBoundingClientRect().width
            let height = oDiv.getBoundingClientRect().height
            if (x < -width / 2) x = -width / 2
            if (x > width / 2) x = width / 2

            if (y < -height / 2) y = -height / 2
            if (y > height / 2) y = height / 2

            //移动当前元素
            oDiv.style.left = x + 'px';
            oDiv.style.top = y + 'px';
            oDiv1.style.left = x + 'px';
            oDiv1.style.top = y + 'px';
          };
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
      /**
       * 右键保存当前x,y
       * @param ev
       */
      onContextmenu(ev) {
        this.params.x = ev.offsetX
        this.params.y = ev.offsetY
      },
      /**
       * 查看报修单详情
       * @param row
       */
      handleOpenDetail(row) {
        getBxdDetail(row.id).then(res => {
          if (res.obj.blist) {
            this.dialogVisibleBxd = true
            this.bxdInfo = res.obj.blist[0]
          } else {
            this.$message.error('数据异常')
          }
        })
      },
      /**
       * 隐藏报修单弹框列表
       */
      hideBxdlistPopover() {
        this.region.forEach(v => v.visible = false)
      },
      /**
       * 重置视图
       */
      resetImageView() {
        this.hideBxdlistPopover()
        let dom1 = this.$refs.imageWrapper
        let dom2 = this.$refs.imageMark
        dom1.style.transform = 'scale(1)'
        dom1.style.left = 0
        dom1.style.top = 0
        dom2.style.transform = 'scale(1)'
        dom2.style.left = 0
        dom2.style.top = 0
      },
      /**
       * 显示更新区域弹框
       * @param params
       */
      showRegionUpdateDialog(params) {
        this.setMarkPosi(params)
        this.dialogVisiblePosi = true
        this.dialogVisiblePosiTitle = params.qy + ' -- 选择位置'
      },
      /**
       * 设置标注位置
       * @param posi
       */
      setMarkPosi(posi) {
        this.markPosi.x = posi.x
        this.markPosi.y = posi.y
      },
      /**
       * 参数x,y赋值
       * @param posi
       */
      setMarkPosiToParams(posi) {
        this.updateParams.x = posi.x
        this.updateParams.y = posi.y
        this.dialogVisiblePosi = false
      },
      /**
       * 添加视图缓存
       */
      cacheViews() {
        if (!this.views.includes(this.showType)) {
          this.views.push(this.showType)
        }
      },
      /**
       * 移除视图缓存
       */
      removeViews() {
        this.views.pop()
        this.showType = this.views[this.views.length - 1]
      },
      /**
       * 获取区域二维码列表
       * 一个区域可能有很多个地方
       */
      getQrcode(qy) {
        if (!qy) {
          this.$message.error('请选择区域')
          return
        }
        // this.showType = '' // 清空视图，避免二维码二次渲染
        setTimeout(() => {
          this.showType = 'qrcode' // 二维码视图
          this.cacheViews()
          this.$nextTick(() => {
            this.tableHeight = this.$refs['mainContent'].offsetHeight
            this.qrcodeParams['qid'] = qy
            AdminServlet(this.filterParams(this.qrcodeParams)).then(res => {
              if (res.obj.ewmlist) {
                // 表格数据
                this.qrcode = res.obj.ewmlist.map(v => {
                  v['qrcodeid'] = 'qrcode-' + v.id // randomKey()
                  v['qrcodeurl'] = this.config.qrcode + v.id
                  return v
                });
                this.$nextTick(() => {
                  this.createQrcode()
                })
              }
            })
          })
        }, 10)
      },
      /**
       * 添加二维码
       */
      addQrcode() {
        if (!this.qy) {
          this.$message.error('请选择区域')
          return
        }
        this.dialogVisibleQrcodeAdd = true
        this.$nextTick(() => {
          this.$refs['addQrcodeForm'].resetFields()
        })
      },
      /**
       * 点击二维码修改按钮
       * @param row
       */
      handleQrcodeEdit(row) {
        this.dialogVisibleQrcodeUpdate = true
        this.updateQrcodeParams.eid = row.id
        this.updateQrcodeParams.qid = row.qid
        this.updateQrcodeParams.xxdd = row.xxdd
      },
      /**
       * 二维码新增提交
       * @param formName
       */
      addQrcodeSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addQrcodeParams['qid'] = this.qy
            let params = this.filterParams(this.addQrcodeParams)
            AdminServlet(params).then(res => {
              let ret = message(res, '修改成功')
              if (ret) {
                this.dialogVisibleQrcodeAdd = false
                this.getQrcode(this.qy)
              }
            })
          }
        })
      },
      /**
       * 二维码修改提交
       * @param formName
       */
      updateQrcodeSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.filterParams(this.updateQrcodeParams)
            AdminServlet(params).then(res => {
              let ret = message(res, '修改成功')
              if (ret) {
                this.dialogVisibleQrcodeUpdate = false
                this.getQrcode(this.qy)
              }
            })
          }
        })
      },
      /**
       * 二维码放大
       * @param row
       */
      handleQrcodeZoomIn(row) {
        this.dialogVisibleQrcodeZoomIn = true
        let { qrcodeurl, xxdd } = row
        this.$nextTick(() => {
          this.qrcodeXxdd = xxdd
          if (this.qrcodeZoomIn) {
            this.qrcodeZoomIn.clear() // 清除代码
            this.qrcodeZoomIn.makeCode(qrcodeurl) // 生成另外一个二维码
          } else {
            this.qrcodeZoomIn = new QRCode('qrcodeZoomIn', {
              width: 400, // 设置宽度，单位像素
              height: 400, // 设置高度，单位像素
              text: qrcodeurl, // 设置二维码内容或跳转地址
              colorDark: '#282828',
              colorLight: '#ffffff'
            })
          }
        })
      },
      /**
       * pagesize改变时的触发事件
       * currentPage改变时的触发事件
       * @param paginationInfo
       */
      handleSizeChange() {
        // 清除二维码
        this.tableData.forEach(v => {
          if (v.qrcode) {
            v.qrcode.clear()
          }
        })
        this.$nextTick(() => {
          this.createQrcode()
        })
      },
      /**
       * 创建二维码
       */
      createQrcode() {
        this.tableData.forEach(v => {
          v.qrcode = new QRCode(v.qrcodeid, {
            width: 60, // 设置宽度，单位像素
            height: 60, // 设置高度，单位像素
            text: v.qrcodeurl, // 设置二维码内容或跳转地址
            colorDark: '#282828',
            colorLight: '#ffffff',
            useSVG: true
          })
        })
      },
      /**
       * 遮罩，鼠标按下
       */
      onMouseDown() {
        this.$refs.imageMark.style.background = 'rgba(25, 64, 93, 0.5)'
      },
      /**
       * 遮罩，鼠标抬起
       */
      onMouseUp() {
        this.$refs.imageMark.style.background = 'rgba(25, 64, 93, 0)'
      },
      /**
       * 查看所有区域列表
       */
      showAreaList() {
        this.showType = 'area'
        this.cacheViews()
        this.$nextTick(() => {
          this.tableHeight = this.$refs['mainContent'].offsetHeight
        })
      },
      /**
       * 区域列表格，区域类别过滤
       * @param value
       * @param row
       * @returns {boolean}
       */
      filterQylb(value, row) {
        return value === row.qylb
      }
    },
    beforeRouteLeave(to, from, next) {
      this.stopMonitor()
      next()
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    // display: flex;
    // flex-direction: column;

    &-header {
      padding: 10px 0;
      box-sizing: border-box;
      line-height: 40px;
      margin: 0 20px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;

      span.title {
        margin-right: 5px;
        color: #606266;
        font-size: 14px;
      }

      .el-select {
        margin-right: 10px;
      }
    }

    &-content {
      // flex: 1;
      // overflow: hidden;
      /*width: 1310px;*/
      /*height: 750px;*/
      margin: 0 20px;
      position: relative;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 1px 2px 6px #d2d2d2;
      overflow: hidden;
      user-select: none;

      .image-tips {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 3;
      }

      .image-recovery {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 3;
      }

      .image-mask {
        position: absolute;
        top: 10px;
        right: 120px;
        z-index: 3;
      }

      .image-wrapper {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .image-mark-copy {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        cursor: grab;
        pointer-events: none;
      }

      .image-mark {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        cursor: grab;
        /*background: rgba(25, 64, 93, 0.5);*/
        .mark-item {
          position: absolute;
          z-index: 99;
          color: #fff;
          font-size: 14px;
          text-align: center;
          cursor: pointer;

          .marker {
            width: auto;
            height: 20px;
            color: #000;
            background: #fff;
            border-radius: 0 20px 20px 0;
            margin: 0;
            display: flex;
            align-items: center;

            .name {
              font-size: 10px;
              padding: 2px;
            }

            .count {
              width: 20px;
              height: 20px;
              line-height: 20px;
              display: inline-block;
              font-size: 12px;
              color: #fff;
              background-color: #f77214;
              border-radius: 50%;
            }
          }
        }
      }

      .qrcode-content {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 5000;
        background: #fff;
      }

      div.qrcode {
        display: inline-block;

        /deep/ img {
          border: 1px solid #282828;
          padding: 6px; // 利用padding的特性，挤出白边
        }
      }

      svg.qrcode {
        width: 70px;
        height: 70px;
        cursor: zoom-in;
        /*border: 1px solid #282828;*/
        /*padding: 6px; // 利用padding的特性，挤出白边*/
      }
    }


    &-footer {
      width: 100%;
      height: 50px;
      margin: 0 20px;
      display: flex;
      align-items: center;
    }
  }
</style>
<style lang="scss">
  .main-header-select {
    z-index: 10000 !important;
  }

  .el-select-dropdown {
    z-index: 5001 !important;
  }

  .el-table-filter {
    z-index: 5002 !important;
  }

  .v-modal {
    /*z-index: 9999 !important;*/
  }

  .add-dialog {
    z-index: 10000 !important;
  }

  .dialog-posi {
    .el-dialog__body {
      padding: 0 10px 10px;

      .el-dialog-div {
        height: 75vh;
        overflow: hidden;
      }
    }
  }

  .preview-dialog {
    z-index: 10000 !important;

    .el-dialog__body {
      padding-top: 0;

      .xxdd {
        text-align: center;
        margin: 5px 0 10px;
      }
    }
  }

  .context-menu {
    position: fixed;
    background: #fff;
    border-radius: 1px;
    z-index: 999;
    display: none;
  }

  .context-menu a {
    width: 75px;
    height: 26px;
    line-height: 26px;
    padding: 2px;
    text-align: center;
    display: block;
    font-size: 14px;
    color: #1a1a1a;
    text-decoration: none;
    box-shadow: 1px 3px 5px rgba(0, 0, 0, .2);
  }

  .context-menu a:hover {
    background: #42b983;
    color: #fff;
  }
</style>
