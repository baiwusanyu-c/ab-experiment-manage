<template>
  <div class="report-base">
    <h3>
      <el-icon color="#409EFF" size="30px"><Platform /></el-icon>
      报告总览
    </h3>
    <div class="entry-num">
      <el-icon color="#F56C6C" size="25px">
        <Avatar />
      </el-icon>
      <p>总进组用户数</p>
    </div>
    <h2 class="entry-val">{{ computeValToComma(reportBase.total) }}</h2>
    <div
      v-for="item in reportBase.versions"
      :key="item.versionId"
      class="version"
      :style="{ 'border-left-color': randomColor({ seed: item.versionId * 10 + 'versions' }) }">
      <div class="version-item__name">{{ item.versionName }}</div>
      <div class="version-item">
        <el-progress
          type="circle"
          :color="randomColor({ seed: item.versionId * 10 + 'versions' })"
          :percentage="computeGroupProportion(item.totalPerson, reportBase.total)" />
      </div>
      <div class="version-item">
        <p class="title">进组占比</p>
        <p class="val">{{ computeGroupProportion(item.totalPerson, reportBase.total) }}%</p>
      </div>
      <div class="version-item">
        <p class="title">进组人数</p>
        <p class="val person">{{ item.totalPerson }}</p>
      </div>
      <div class="version-item">
        <p class="title">流量权重</p>
        <p class="val">{{ item.trafficWeight }}%</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="ReportBase">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import randomColor from 'randomcolor'
  import { numDivision, numberToCommaString } from '../../../../utils/ruoyi'
  import { reportOverview } from '../../../../api/ab-test/ab-test'
  import type { IReportBase } from '../../../../utils/types'
  const reportBase = ref<IReportBase>({})
  const loading = ref<boolean>(false)
  const getData = () => {
    loading.value = true
    reportOverview({ experimentId: expId.value })
      .then((res: any) => {
        if (res) {
          reportBase.value = res.data
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const computeValToComma = computed(() => {
    return function (val: number) {
      return numberToCommaString(val, 3)
    }
  })
  const computeGroupProportion = computed(() => {
    return function (val: number, total: number) {
      return (numDivision(val, total) * 100).toFixed(3)
    }
  })

  const route = useRoute()
  const expId = ref<string>('')
  const init = () => {
    if (route.query.expId) {
      expId.value = route.query.expId as string
      getData()
    }
  }
  init()
</script>

<style scoped lang="scss">
  .report-base {
    border-radius: 4px;
    border: 1px solid #e5e6e7;
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    h3 {
      display: flex;
      align-items: center;
      .el-icon {
        margin-right: 0.5rem;
      }
    }
    .entry-num {
      display: flex;
      align-items: center;
      p {
        margin: 0 0 0 0.5rem;
      }
    }
    .entry-val {
      margin: 0.5rem 2rem 2rem 2rem;
    }
    .version {
      border-radius: 4px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border: 1px solid #e5e6e7;
      border-left-width: 6px;
      box-sizing: border-box;
      padding: 1rem 1.5rem;
      display: grid;
      grid-template-columns: repeat(5, 160px);
      grid-template-rows: 120px;
      margin-bottom: 1rem;
      .val {
        font-weight: bolder;
      }
      .val.person {
        color: #409eff;
      }
      .title {
        color: #909399;
        margin: 0;
      }
      .version-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .version-item__name {
        word-break: break-all;
      }
    }
  }
</style>
