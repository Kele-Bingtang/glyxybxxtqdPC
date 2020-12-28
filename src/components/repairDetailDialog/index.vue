<template>
  <div>
    <el-dialog
      title="报修单详情"
      :visible.sync="innerVisible"
      class="bxd-dialog"
      width="60%"
      top="40px"
      center
    >
      <el-form v-if="showInfo" :inline="true" label-position="left" label-width="110px" class="bxd-detail-form">

        <!-- 报修单二维码 -->
        <el-form-item class="qrcode-form-item" label-width="0px">
          <div class="qrcode" id="qrcode"></div>
          <div class="qrcode-text">扫码查看维修详情</div>
          <span>二维码张贴地址：{{ info.ewmdd }}</span>
        </el-form-item>

        <!-- 报修单进度 -->
        <div class="gap"></div>
        <el-form-item class="steps-form-item">
          <el-steps
            v-if="info.step"
            class="progress-steps"
            :active="info.step.active"
            :space="120"
            direction="vertical"
            process-status="finish"
            finish-status="success"
          >
            <el-step
              class="progress-step"
              v-for="(item, index) of info.step.steps"
              :key="index"
            >
              <div slot="title" class="title" v-html="item.title"></div>
              <div slot="description">
                <div class="date">{{item.time}}</div>
                <div class="desc" v-html="item.desc"></div>
              </div>
            </el-step>
          </el-steps>

        </el-form-item>

        <!-- 报修单相关信息 -->
        <div class="gap">报修单</div>
        <div class="content">
          <el-form-item label="报修单号:">
            <span>{{ info.id }}</span>
          </el-form-item>
          <el-form-item label="校 区:">
            <span>{{ info.xq }}</span>
          </el-form-item>
          <el-form-item label="区 域:">
            <span>{{ info.qy }}</span>
          </el-form-item>
          <el-form-item label="详细地址:">
            <span>{{ info.xxdd }}</span>
          </el-form-item>
          <el-form-item label="报修类别:">
            <span>{{ info.bxlb }}</span>
          </el-form-item>
          <el-form-item label="报修内容:">
            <span>{{ info.bxnr }}</span>
          </el-form-item>
          <el-form-item label="报修时间:">
            <span>{{ info.sbsj | dateformat(format) }}</span>
          </el-form-item>
          <el-form-item label="预约时间:">
            <span>{{ info.yysj }}</span>
          </el-form-item>
          <el-form-item label="耗材:">
            <span>{{ info.hc }}</span>
          </el-form-item>
          <el-form-item label="工时:">
            <span>{{ info.gs }}</span>
          </el-form-item>
          <el-form-item label="相关图片:" class="tp-form-item">
            <el-image
                class="info-image"
                v-for="(item, index) of info.images"
                :key="index"
                :src="item"
                fit="cover"
                @click="onImageClick(index)"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-form-item>

          <!-- 申报人相关信息 -->
          <div class="gap">申报人</div>
          <el-form-item label="姓名:">
        <span>{{ info.sbr }}
        </span>
          </el-form-item>
          <el-form-item label="申报人手机:">
            <span>{{ info.sbrsj }}</span>
          </el-form-item>
          <el-form-item label="申报人学号:">
            <span>{{ info.sbrxh }}</span>
          </el-form-item>

          <!-- 接单人相关信息 -->
          <div class="gap">接单人</div>
          <el-form-item label="姓名:">
            <span>{{ info.j && info.j.xm }}</span>
          </el-form-item>
          <el-form-item label="工号:">
            <span>{{ info.j && info.j.gh }}</span>
          </el-form-item>
          <el-form-item label="手 机:">
            <span>{{ info.j && info.j.sj }}</span>
          </el-form-item>
          <el-form-item label="邮 箱:">
            <span>{{ info.j && info.j.yx }}</span>
          </el-form-item>
          <el-form-item label="服务星级:">
            <template v-if="info.state === 2 || info.state === 4">
              <el-rate
                  v-if="info.j && info.pj"
                  v-model="info.pj"
                  disabled
                  show-text
                  :max="max"
                  :texts="evaluate"
                  text-color="#ff9900">
              </el-rate>
            </template>
          </el-form-item>
          <el-form-item label="服务评价:" class="evaluate-form-item">
            <template v-if="info.state === 2 || info.state === 4">
              <span v-if="info.j && info.pj && info.pjnr">{{info.pjnr}}</span>
              <span v-else-if="info.j && info.pj && !info.pjnr">无</span>
              <span v-else-if="info.j && !info.pj && !info.pjnr">暂未评价</span>
            </template>
          </el-form-item>

          <!-- 审核员1相关信息 -->
          <div class="gap">审核员1</div>
          <el-form-item label="姓名:">
            <span>{{ info.s1 && info.s1.xm }}</span>
          </el-form-item>
          <el-form-item label="工号:">
            <span>{{ info.s1 && info.s1.gh }}</span>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-tag :type="info.shy1tag">{{info.shy1text}}</el-tag>
          </el-form-item>

          <!-- 审核员2相关信息 -->
          <div class="gap">审核员2</div>
          <el-form-item label="姓名:">
            <span>{{ info.s2 && info.s2.xm }}</span>
          </el-form-item>
          <el-form-item label="工号:">
            <span>{{ info.s2 && info.s2.gh }}</span>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-tag :type="info.shy2tag">{{info.shy2text}}</el-tag>
          </el-form-item>
        </div>

      </el-form>

      <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain @click="handleClose">关 闭</el-button>
    </span>

    </el-dialog>

    <el-dialog
      :visible.sync="isShowImageDialog"
      top="120px"
      width="860px"
      :modal="true"
      class="image-dialog"
    >
      <div class="image-dialog-carousel">
        <el-carousel :key="randKey" :initial-index="initialIndex" :autoplay="false" indicator-position="outside">
          <el-carousel-item v-for="(src, index) in info.images" :key="index">
            <img :src="src" style="max-width: 100%;max-height: 100%; margin: 0 auto;"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { randomKey } from '@/utils/common'
  import config from '@/config'
  import QRCode from 'qrcodejs2' // 二维码插件
  import { mapGetters } from 'vuex'

  export default {
    name: 'RepairDetailDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      bxdInfo: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        isShowImageDialog: false,
        initialIndex: 0,
        randKey: '',
        info: '',
        innerVisible: this.visible,
        format: 'YYYY-MM-DD HH:mm',
        qrcode: null,
        evaluate: config.evaluate, // 服务评价文字表述
        shState: config.shState // 审核状态
      }
    },
    computed: {
      ...mapGetters(['config']),
      max() {
        return config.evaluate.length
      },
      showInfo() {
        return Object.keys(this.info).length
      }
    },
    watch: {
      visible(val, oldVal) {
        if (val === oldVal) {
          return
        }
        if (val) {
          // 赋值
          this.info = this.bxdInfo
          // 重置表单
          this.resetBxdInfo()
        }
        this.innerVisible = val
      },
      // 如果内部有新值变化，更新外部visible
      innerVisible(val, oldVal) {
        if (val === oldVal) {
          return
        }
        this.$emit('update:visible', val)
      }
    },
    methods: {
      resetBxdInfo() {
        if (Object.keys(this.info).length > 0) {
          this.formatInfo()
          this.createQrcode() // 二维码
          this.clearBxImage() // 报修图片
          this.createSteps() // 报修进度
        }
      },
      /**
       * 对一些字段进行处理
       */
      formatInfo() {
        const info = this.info
        // 评价
        info.pj = Number(info.pj)
        // 审核员1
        if (!info.s1) {
          info.s1 = {
            xm: '--',
            gh: '--'
          }
        }
        let state1 = this.getShState(info.shy1state)
        info.shy1tag = state1.tag
        info.shy1text = state1.text
        // 审核员2
        if (!info.s2) {
          info.s2 = {
            xm: '--',
            gh: '--'
          }
        }
        let state2 = this.getShState(info.shy2state)
        info.shy2tag = state2.tag
        info.shy2text = state2.text
      },
      createQrcode() {
        // 这里是移动端报修详情的地址
        const path = config.declareDetailsPath.replace(':id', this.info.id)
        const qrcodeUrl = `${this.config.bxqtUrl}${path}`
        this.$nextTick(() => {
          this.createQRcode(qrcodeUrl)
        })
      },
      clearBxImage() {
        // 提取报修图片
        if (this.info.tp.length > 0) {
          let images = []
          const arr = this.info.tp.split('|')
          arr.shift()
          images = arr.map(item => {
            return `${this.config.bxdimg}/${item}`
          })
          this.$set(this.info, 'images', images)
        }
      },
      createSteps() {
        const me = this
        // 添加进度步骤
        const step = {
          active: 0,
          steps: []
        }
        // 报修单状态，0未派单，1已派单，2已维修，3撤销单
        const state = Number(this.info.state)

        if (state === 0) { // 未派单
          step.active = 0
          step1()
        } else if (state === 1) { // 已派单，申报之后自动派单
          step.active = 1
          step1()
          step2()
        } else if (state === 2) { // 已维修
          step.active = 1
          step1()
          step2()
        } else if (state === 3) { // 撤销单
          if (this.info.j) { // 有接单人信息，说明已经派单，此时撤回属于第3步
            step.active = 2
            step1()
            step2()
            step4()
          } else {
            step.active = 1 // 没有有接单人信息，说明还未派单，是申报人或者后台管理员撤销的，此时撤回没有“维修中”这个状态，第2步直接是已撤回
            step1()
            step4()
          }
        }else if (state === 4){ //验收通过单
            step.active = 4;
            step1();
            step2();
            step3();
        }else if (state === 5){ // 验收未通过
          step.active = 1;
          step1();
          step2();
        }
        this.info = Object.assign({}, this.info, {
          step: step
        })

        function step1() {
          const bxsj = me.$moment(me.info.sbsj).format(me.format)
          step.steps.push({
            title: '申报中',
            time: bxsj,
            desc: `<span class="name">${me.info.sbr}</span>于${bxsj}提交了维修申报.`
          })
        }

        function step2() {
          let desc;
          let title = '维修中';
          if (me.info.j) {
            const tel = me.info.j.sj
            desc = tel ? `系统已自动派单给维修师傅<span class="name">${me.info.j.xm}</span>(<a class="tel" href="tel:${tel}">${tel}</a>)，等待处理...`
              : `系统已自动派单给维修师傅<span class="name">${me.info.j.xm}</span>，等待处理...`
            if(me.bxdInfo.state == 2 || me.bxdInfo.state == 4) {
              desc = '当前订单已完成修理，等待验收...';
              title = '已维修';
            }else if(me.bxdInfo.state == 5){
              desc = '当前订单已完成修理，但验收未通过。';
              title = `<span style="color: red">未通过</span>`;
            }
          } else {
            desc = '等待管理员指派维修师傅，请耐心等待...'
          }
          step.steps.push({
            title: title,
            time: me.$moment(me.info.sbsj).format(me.format),
            desc: desc
          })
        }

        function step3() {
          step.steps.push({
            title: '已完成',
            time: me.info.wxsj ? me.$moment(me.info.wxsj).format(me.format) : '--',
            desc: '维修工作已完成，工单结束.'
          })
        }

        function step4() {
          step.steps.push({
            title: '已撤回',
            time: me.info.wxsj ? me.$moment(me.info.wxsj).format(me.format) : '--',
            desc: `申报已撤回，原因：<span class="name">${me.info.cxsy}</span>.`
          })
        }
      },
      handleClose() {
        this.clearQRcode()
        this.innerVisible = false
      },
      /**
       * 生成二维码
       */
      createQRcode(url) {
        if (this.qrcode) {
          this.qrcode.clear() // 清除代码
          this.qrcode.makeCode(url) // 生成另外一个二维码
        } else {
          this.qrcode = new QRCode('qrcode', {
            width: 140, // 设置宽度，单位像素
            height: 140, // 设置高度，单位像素
            text: url, // 设置二维码内容或跳转地址
            colorDark: '#242424',
            colorLight: '#fff'
          })
        }
      },
      /**
       * 弹框关闭，销毁二维码
       */
      clearQRcode() {
        if (this.qrcode) {
          this.qrcode.clear() // 清除代码
        }
      },
      /**
       * 预览图片
       * @param index
       */
      onImageClick(index) {
        this.randKey = randomKey()
        this.isShowImageDialog = true
        this.initialIndex = index
      },
      /**
       * 审核状态
       * @param state 0 1 2
       */
      getShState(state) {
        let v = this.shState.filter(v => v.value === Number(state))[0]
        return v
      }
    }
  }
</script>

<style lang="scss">
  .bxd-dialog {
    .el-dialog {
      min-width: 1050px;

      .el-dialog__body {
        /*padding: 0 0 0 140px;*/
        padding: 10px 0 30px 10px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;

        .bxd-detail-form {
          height: 72vh;
          overflow: auto;
          text-align: center;

          .el-form-item {
            margin-bottom: 12px;

            .el-form-item__label {
              font-size: 16px;
              color: #99a9bf;
              line-height: 30px;
            }

            .el-form-item__content {
              font-size: 16px;
              line-height: 30px;
              /*padding: 0 170px 0 40px;*/
              padding: 0;
              width: 200px;
              text-align: left;
            }
          }

          .qrcode-form-item {
            .el-form-item__content {
              margin-top: 20px;
              text-align: center;

              .qrcode {
                display: inline-block;
                img {
                  border: 1px solid #282828;
                  padding: 6px; // 利用padding的特性，挤出白边
                }
              }

              .qrcode-text {
                color: #777;
              }
            }
          }

          .steps-form-item {
            /*margin: 30px 0 0 -100px;*/
            /*margin: 30px 0 0 100px;*/
            margin-top: 15px;

            .progress-steps {
              width: 450px;

              .title {
                font-size: 18px;
              }

              .date {
                font-size: 15px;
                line-height: 24px;
              }

              .desc {
                font-size: 15px;
                line-height: 24px;

                a {
                  color: #f59025;
                }

                .name {
                  color: #ff2e2e;
                  font-weight: bold;
                }
              }
            }
          }

          .tp-form-item {
            .el-form-item__content {
              width: 520px; //848px;
            }
          }

          .status-form-item {
            color: #1890ff;
          }

          .info-image {
            width: 100px;
            height: 100px;
            margin: 0 15px 10px 0;
            cursor: pointer;
          }

          .success-form-item {
            color: #67C23A;
          }

          .evaluate-form-item {
            color: #f90;
          }

          .gap {
            width: 90%;
            display: flex;
            align-items: center;
            margin: 35px auto 20px;
            color: #000;
            font-size: 16px;
            line-height: 24px;
            border-color: #ddd;
            border-style: dashed;
            border-width: 0;
          }

          .gap::before, .gap::after {
            display: block;
            flex: 1;
            box-sizing: border-box;
            content: '';
            height: 1px;
            border-color: inherit;
            border-style: inherit;
            border-width: 1px 0 0;
          }

          .gap::before {
            margin-right: 16px;
          }

          .gap::after {
            margin-left: 16px;
          }

          .content {
            text-align: left;
            padding-left: 40px;
          }
        }
      }
    }
  }

  .image-dialog {
    .el-dialog {
      .el-dialog__body {
        padding: 25px 25px 30px;
        border: none;

        .image-dialog-carousel {
          height: 60vh;

          .el-carousel--horizontal {
            height: 100%;
            overflow: hidden;
            text-align: center;

            .el-carousel__container {
              height: 90%;

              .el-carousel__item {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
      }
    }
  }
</style>
