<template>
  <router-view />
</template>

<script lang="ts">
import useSettingsStore from './store/modules/settings'
import { handleThemeStyle } from './utils/theme'
import {defineComponent,onMounted,nextTick} from "vue";
export default defineComponent({
  setup(){
    onMounted(() => {
      nextTick(() => {
        // 初始化主题样式
        handleThemeStyle(useSettingsStore().theme)
      })
    })
    return {

    }
  }
})

</script>
