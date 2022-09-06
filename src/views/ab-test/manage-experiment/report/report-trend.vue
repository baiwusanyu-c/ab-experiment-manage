<template>
  <div class="report-trend">
    <h3>
      <el-icon color="#409EFF" size="30px"><TrendCharts /></el-icon>
      天级趋势
    </h3>
    <div id="report_trend_container"></div>
  </div>
</template>

<script name="ReportTrend" lang="ts" setup>

  import { nextTick, watch } from "vue";
  import { useRoute } from 'vue-router'
  import * as echarts from 'echarts'
  import { dailyReport } from '../../../../api/ab-test/ab-test'
  const getChartData = () => {
    dailyReport({experimentId: expId,indicatorsName:props.indicatorsName}).then(res=>{
      renderChart(res.data)
    })
  }
  const renderChart = data => {
    const container = document.getElementById('report_trend_container') as HTMLInputElement
    if (!container) return
    const echartsInstance = echarts.init(container, 'macarons')
    const option = {
      xAxis: {
        type: 'category',
        data: data.date,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [],
      },
      grid: {
        left: 100,
        right: 100,
      },
      yAxis: {
        type: 'value',
      },
      series: [],
    }
    for (let i = 0; i < data.indicators.length; i++) {
      option.series.push({
        name: data.indicators[i].versionName,
        data: data.indicators[i].indicatorValue,
        type: 'line',
      })
      option.legend.data.push(data.indicators[i].versionName)
    }
    echartsInstance.setOption(option)
  }

  const props = defineProps({
      indicatorsName: {
        required: true,
        default:'',
        type: String
      }
    })
  watch(()=>props.indicatorsName,(nVal)=>{
    if(nVal){
      init()
    }
  })
  const route = useRoute()
  let expId = ''
  const init = () => {
    if (route.query.expId) {
      expId = route.query.expId as string
      nextTick(() => {
        getChartData()
      })
    }
  }
</script>

<style scoped lang="scss">
  .report-trend {
    margin-top: 2rem;
    border-radius: 0.1rem;
    border: 1px solid #e5e6e7;
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    h3{
      display: flex;
      align-items: center;
      .el-icon{
        margin-right: .5rem;
      }
    }
    #report_trend_container {
      height: 25rem;
      width: 100%;
    }
  }
</style>
