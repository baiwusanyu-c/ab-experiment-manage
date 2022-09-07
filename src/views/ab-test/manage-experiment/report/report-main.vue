<template>
  <div class="app-container reporter-container">
    <report-base></report-base>
    <report-quota @select="handleSelect"></report-quota>
    <report-trend :indicators-name="indicatorsName"></report-trend>
  </div>
</template>

<script lang="ts" setup name="ReportMain">
  import { ref } from 'vue'
  import ReportBase from './report-base.vue'
  import ReportQuota from './report-quota.vue'
  import ReportTrend from './report-trend.vue'
  const indicatorsName = ref<string>('')
  const handleSelect = (data: string) => {
    indicatorsName.value = data
  }
</script>

<style scoped>
  .reporter-container {
    min-width: 900px;
  }
</style>
