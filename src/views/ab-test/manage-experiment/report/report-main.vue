<template>
  <div class="app-container reporter-container">
    <report-base></report-base>
    <report-quota></report-quota>
    <report-trend></report-trend>
  </div>
</template>

<script lang="ts" setup name="ReportMain">
  import ReportBase from './report-base.vue'
  import ReportQuota from './report-quota.vue'
  import ReportTrend from './report-trend.vue'
</script>

<style scoped>
  .reporter-container {
    min-width: 900px;
  }
</style>
