<template>
  <div class="app-container reporter-container">
    <report-base></report-base>
    <report-quota @select = 'handleSelect'></report-quota>
    <report-trend :indicatorsName = 'indicatorsName'></report-trend>
  </div>
</template>

<script lang="ts" setup name="ReportMain">
  import ReportBase from './report-base.vue'
  import ReportQuota from './report-quota.vue'
  import ReportTrend from './report-trend.vue'
  import { ref } from "vue";
  const indicatorsName = ref<string>('')
  const handleSelect = (data :string) =>{
    indicatorsName.value = data
  }
</script>

<style scoped>
  .reporter-container {
    min-width: 900px;
  }
</style>
