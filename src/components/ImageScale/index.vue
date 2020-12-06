<template>
  <div ref="imageScaleWrapper" class="image-scale-wrapper" @mousewheel="onMousewheel($event)">
    <div class="image-wrapper" ref="imageWrapper">
      <el-image
        style="width: 100%; height: 100%;"
        :src="img"
        fit="cover"></el-image>
    </div>
    <div class="image-mark" ref="imageMark" @contextmenu.prevent="handleClick">
      <div class="marker" :style="{ left: markPosi.x + 'px', top: markPosi.y - 30 + 'px' }">
        <el-image style="width: 30px; height: 30px" :src="mark"></el-image>
      </div>
    </div>
    <div class="image-tips">
      <el-alert
        title="*提示：鼠标拖拽移动图片，鼠标滚轮缩放图片，鼠标右击更改位置，点选后点击下方确定按钮"
        :closable="false"
        effect="dark"
        type="error">
      </el-alert>
    </div>
    <div class="image-posi">
      <el-alert
        :title='alertTitle'
        type="success"
        :closable="false"
        effect="dark">
      </el-alert>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageScale", // 图片拖拽缩放组件
    props: {
      img: {
        type: String,
        required: true
      },
      markPosi: {
        type: Object
      }
    },
    data() {
      return {
        mark: require('./mark.png')
      }
    },
    computed: {
      alertTitle () {
        return `x: ${this.markPosi.x}, y: ${this.markPosi.y}`
      }
    },
    mounted() {
      this.onDrag()
      this.setWrapperHeight()
    },
    methods: {
      /**
       * 根据图片的宽高比例和自身高度设置宽度
       * 图片 8400:5600
       */
      setWrapperHeight() {
        // let width = this.$refs.imageScaleWrapper.offsetWidth
        // let height = (5600 / 8400) * width
        // this.$refs.imageScaleWrapper.style.height = height + 'px'

        const config = this.$store.getters.config
        this.$refs.imageScaleWrapper.style.width = config.mapwidth
        this.$refs.imageScaleWrapper.style.height = config.mapheight
      },
      /**
       * 监听鼠标滚轮，div放大缩小
       * @param ev
       */
      onMousewheel(ev) {
        /* 获取当前页面的缩放比
           若未设置zoom缩放比，则为默认100%，即1，原图大小
       */
        let dom1 = this.$refs.imageMark
        let dom2 = this.$refs.imageWrapper
        let transform = getComputedStyle(dom1).transform
        let scale = parseFloat(transform.substring(7).split(','))
        let zoom = scale || 1;

        /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
              wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
          */
        zoom += ev.wheelDelta / 500

        /* 最小范围 和 最大范围 的图片缩放尺度 */
        if (zoom >= .5) {
          dom1.style.transform = 'scale(' + zoom + ')'
          dom2.style.transform = 'scale(' + zoom + ')'
        }
      },
      /**
       * 监听div位置变化
       */
      onDrag() {
        let oDom1 = this.$refs.imageMark
        let oDom2 = this.$refs.imageWrapper
        oDom1.onmousedown = function (e) {
          //鼠标按下，计算当前元素距离可视区的距离
          let disX = e.clientX - oDom1.offsetLeft
          let disY = e.clientY - oDom1.offsetTop
          document.onmousemove = function (e) {
            //通过事件委托，计算移动的距离
            let x = e.clientX - disX;
            let y = e.clientY - disY;
            // 防止越界
            let width = oDom1.getBoundingClientRect().width
            let height = oDom1.getBoundingClientRect().height
            if (x < -width / 2) x = -width / 2
            if (x > width / 2) x = width / 2

            if (y < -height / 2) y = -height / 2
            if (y > height / 2) y = height / 2
            //移动当前元素
            oDom1.style.left = x + 'px'
            oDom1.style.top = y + 'px'
            oDom2.style.left = x + 'px'
            oDom2.style.top = y + 'px'
          };
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          };
        };
      },
      handleClick(ev) {
        this.markPosi.x = ev.offsetX
        this.markPosi.y = ev.offsetY
        this.$emit('change', this.markPosi)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-scale-wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;

    .image-wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .image-mark {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      cursor: grab;

      .marker {
        position: absolute;
        z-index: 99;
        color: #fff;
        font-size: 14px;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        /*background: #f00;*/
        border-radius: 50%;
        margin: auto;
      }
    }

    .image-tips {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3
    }

    .image-posi {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 3
    }
  }
</style>
