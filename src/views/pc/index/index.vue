<template>
  <div class="main">
    <div class="dashboards">
      <div class="header">
        工单统计
      </div>
      <div class="content">
        <el-row :gutter="20" v-if="data">
          <el-col :span="6">
            <dashboard color="#58B5FB" icon="dashboard-zbxd" :value="data.zbxd" label="总报修单"></dashboard>
          </el-col>
          <el-col :span="6">
            <dashboard color="#13ce66" icon="dashboard-wcbxd" :value="data.zwxd" label="总完成维修单"></dashboard>
          </el-col>
          <el-col :span="6">
            <dashboard color="#7A65F2" icon="dashboard-zzbxd" :value="data.zzwx" label="正在维修中"></dashboard>
          </el-col>
          <el-col :span="6">
            <dashboard color="#FF625B" icon="dashboard-cxbxd" :value="data.zcxd" label="总撤销单"></dashboard>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="chart">
      <el-row :gutter="20">
        <el-col :span="8">
          <!--评价饼图-->
          <div class="pj-chart fl">
            <div class="header">评价统计</div>
            <v-chart :options="pieOptions" theme="macarons" autoresize />
          </div>
        </el-col>
        <el-col :span="16">
          <!--报修单柱状图-->
          <div class="bx-chart fr">
            <div class="header">报修统计</div>
            <v-chart :options="barOptions" theme="macarons" autoresize />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  /**
   * @author: lct
   * @date: 2020/8/30
   * @description: 首页统计图表
   */
  import { AdminServlet } from '@/api/AdminServlet';

  export default {
    name: 'index',
    components: {
      Dashboard: () => import('./dashboard')
    },
    data() {
      return {
        pieOptions: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '20',
            data: ['1星', '2星', '3星', '4星', '5星'],
            textStyle: {
              color: '#fff'
            }
          },
          series: {
            name: '维修单评价统计',
            type: 'pie',
            roseType: 'radius',
            radius: ['30%', '75%'],
            center: ['50%', '40%'],
            data: [
              { value: 1, name: '1星', id: 'pj1' },
              { value: 1, name: '2星', id: 'pj2' },
              { value: 1, name: '3星', id: 'pj3' },
              { value: 1, name: '4星', id: 'pj4' },
              { value: 1, name: '5星', id: 'pj5' }
            ],
            label: {
              formatter: '{b} : {c} ({d}%)'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        },
        barOptions: {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['本年报修量', '本年完成量', '本月报修量', '本月完成量', '今日报修量', '今日完成量'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            splitArea: {
              show: true,

            },
          }],
          series: {
            type: 'bar',
            barWidth: '40%',
            data: [
              {
                id: 'yearbx', // id为接口对应字段
                name: '本年报修量',
                value: 0,
                itemStyle: {
                  color: '#FBD437'
                }
              },
              {
                id: 'yearwx',
                name: '本年完成量',
                value: 0,
                itemStyle: {
                  color: '#FBD437'
                }
              },
              {
                id: 'monthbx',
                name: '本月报修量',
                value: 0,
                itemStyle: {
                  color: '#B6A2DE'
                }
              },
              {
                id: 'monthwx',
                name: '本月完成量',
                value: 0,
                itemStyle: {
                  color: '#B6A2DE'
                }
              },
              {
                id: 'daybx',
                name: '今日报修量',
                value: 0,
                itemStyle: {
                  color: '#4ECB73'
                }
              },
              {
                id: 'daywx',
                name: '今日完成量',
                value: 0,
                itemStyle: {
                  color: '#4ECB73'
                }
              }
            ]
          }
        },
        timer: null,
        data: ''
      }
    },
    mounted() {
      this.getDatas()
      this.autoMonitor()
    },
    methods: {
      getDatas() {
        AdminServlet({
          op: 'adminindex'
        }).then(res => {
          if (res) {
            this.getDatasSucc(res.obj)
          } else {
            this.$message.error('数据获取异常，请检查接口')
          }
        }).catch(() => {
          this.$message.error('数据获取失败，请检查接口')
        })
      },
      getDatasSucc(data) {
        this.data = data
        let pieSeries = this.pieOptions.series.data
        pieSeries.map(v => {
          v.value = data[v.id]
        })

        let barSeries = this.barOptions.series.data
        let tjjson = JSON.parse(this.data.tj);
        barSeries.map(v => {
          v.value = tjjson[v.id]
        })
      },
      /**
       * 自动监控，每隔n秒刷新一次数据
       */
      autoMonitor() {
        this.stopMonitor()
        const indextime = this.$store.getters.config.indextime
        if (indextime) {
          this.timer = setInterval(this.getDatas, indextime * 1000)
        }
      },
      /**
       * 停止自动监控
       */
      stopMonitor() {
        clearInterval(this.timer)
        this.timer = null
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .main {
    width: 100%;
    height: 100%;
    min-width: 1300px;
    background-color: #1f2d3d; // 092648
    padding: 20px 20px 40px;
    box-sizing: border-box;
    @include flex-column;

    .header {
      font-size: 16px;
      color: #fff;
      height: 30px;
      line-height: 30px;
      padding: 15px 10px;
    }

    .dashboards {
      width: 100%;
      height: auto;

      .content {
        height: 180px;
        margin-top: 0px;
        display: flex;

        .dashboard {
          /*margin: 0 20px;*/

          &:first-child {
            /*margin-left: 0;*/
          }
        }
      }
    }

    .chart {
      flex: 1;
      width: 100%;
      margin-top: 40px;

      .pj-chart {
        width: 100%;
        height: 100%;
        background-color: #021529;
        border-radius: 5px;
        @include flex-column;
      }

      .bx-chart {
        width: 100%;
        height: 100%;
        background-color: #021529;
        border-radius: 5px;
        @include flex-column;
      }
    }
  }

  .el-row {
    width: 100%;
    height: 100%;

    .el-col {
      height: 100%;
    }
  }

  /**
   * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
   * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
   */
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>
