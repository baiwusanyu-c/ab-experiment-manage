<template>
  <router-view />
</template>
<script setup lang="ts">
  import useCommonParamsStore from './store/modules/common-params'
  // 获取公共参数
  useCommonParamsStore().reqParams()
</script>
