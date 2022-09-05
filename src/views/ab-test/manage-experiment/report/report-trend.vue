<template>
  <div class="report-trend">
    <h3>天级趋势</h3>
    <div id="report_trend_container"></div>
  </div>
</template>

<script name="ReportTrend" lang="ts" setup>
  // TODO: 数据字段对接
  import { nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import * as echarts from 'echarts'
  import { dailyReport } from '../../../../api/ab-test/ab-test'
  const getChartData = () => {
    /*dailyReport({experimentId: expId}).then(res=>{

    })*/
    renderChart({
      date: ['2022-9-1', '2022-9-2', '2022-9-3', '2022-9-4', '2022-9-5', '2022-9-6'],
      value: [
        {
          versionName: 'name1',
          data: [265, 524, 475, 985, 514, 400],
        },
        {
          versionName: 'name2',
          data: [255, 524, 475, 985, 514, 800],
        },
        {
          versionName: 'name3',
          data: [465, 524, 435, 985, 514, 700],
        },
        {
          versionName: 'name4',
          data: [565, 524, 275, 685, 614, 700],
        },
      ],
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
    for (let i = 0; i < data.value.length; i++) {
      option.series.push({
        name: data.value[i].versionName,
        data: data.value[i].data,
        type: 'line',
      })
      option.legend.data.push(data.value[i].versionName)
    }
    echartsInstance.setOption(option)
  }

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
  init()
</script>

<style scoped lang="scss">
  .report-trend {
    margin-top: 2rem;
    border-radius: 0.1rem;
    border: 1px solid #e5e6e7;
    box-sizing: border-box;
    padding: 1rem 1.5rem;

    #report_trend_container {
      height: 25rem;
      width: 100%;
    }
  }
</style>
