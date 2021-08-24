<template>
  <div :style="{width,height}" />
</template>

<script>
import echarts from 'echarts' // 引入echarts
import resize from './mixins/resize'
require('echarts/theme/vintage') // 引入主題
export default {
  name: '',
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    // 传递的系列数据
    chartData: {
      type: Object,
      required: true
    },
    // y轴的名称
    yTittle: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      chart: null
      // $_sidebarElm: null, // sizebar根元素
      // $_resizeHandler: null // 更新图表的函数
    }
  },

  // 為啥要監視？因為數據是異步傳過來的
  watch: {
    chartData: {
      deep: true,
      handler(newVal) {
        this.setOption(newVal)
      }
    }
  },

  mounted() {
    // 使用echarts畫圖的函數
    this.initChart()
  },

  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'vintage')
      this.setOption(this.chartData)
    },

    beforeDestroy() {
      if (!this.chart) {
        return
      }
      // 销毁实例，销毁后实例无法再被使用。
      this.chart.dispose()
      this.chart = null
    },

    // expectedData、actualData 有可能拿不到東西，給個空數組
    setOption({ expectedData = [], actualData = [] }) {
      this.chart.setOption({
      // 圖表的標題
        title: {
          text: 'ECharts 入门示例'
        },

        // 提示
        tooltip: {
          trigger: 'axis', // 坐標軸觸發，主要在柱狀圖，折線圖
          axisPointer: {
            type: 'cross' // 座標型十字準星指示器。
          }

        },

        // 圖例
        legend: {
          data: ['期望', '實際']
        },

        // x坐標軸
        xAxis: {
          data: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
          boundaryGap: false // x軸是否兩邊不留白，和邊緣重合
        },

        // y坐標軸，一般不寫，最多寫y軸名稱
        yAxis: {
          name: this.yTitle
        },

        // 網格，用來設置圖標整體大小的
        grid: {
          left: 10,
          right: 10,
          top: 40,
          bottom: 10,
          containLabel: true // 是否包含圖表的座標軸
        },

        // 系列 (圖例和系列是一組的)
        series: [
          {
            name: '期望', // 和圖例對應的
            type: 'line', // 決定了圖的樣式，是柱狀圖、線狀圖還是餅狀圖 ...
            data: expectedData, // 對應的是圖的數據
            itemStyle: {
              color: 'red' // 修改整個圖相關的顏色，不光是線，還有提示圖例顏色都改了
            },
            lineStyle: {
              width: 4 // 只能修改線的顏色寬度等等
            }
          },
          {
            name: '實際',
            type: 'line',
            data: actualData,
            itemStyle: {
              color: 'pink' // 修改整個圖相關的顏色，不光是線，還有提示圖例顏色都改了
            },
            lineStyle: {
              width: 4 // 只能修改線的顏色寬度等等
            },
            areaStyle: {
              color: '#aaa' // 修改區域的顏色
            }
          }
        ]
      })
    }
  }
}
</script>

<style>

</style>
