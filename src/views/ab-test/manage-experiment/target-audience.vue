<template>
  <div class="target-audience">
    <p>实验流量分配 (%)</p>
    <el-slider
      v-model="audienceForm.experimentTrafficWeight"
      show-input
      :step="0.1"
      @change="handleChange" />
    <p>版本流量分配 (%)</p>
    <div class="version-flow">
      <div
        v-for="(item, index) in versionsForm"
        :key="item.versionDesc"
        class="version-flow-container">
        <span>
          <span :style="{ 'background-color': color[index] }" class="color-ic"></span>
          {{ item.versionName }}
        </span>
        <el-input-number
          v-model="item.versionTrafficWeight"
          step-strictly
          :step="0.1"
          :precision="1"
          :max="100"
          :min="0.1"
          @change="handleChange" />
      </div>
      <span v-show="showErrVer" class="target-audience-err"
        >版本流量分配错误，各版本流量总和必须等于100，请检查</span
      >
    </div>
    <div>
      <p>添加白名单用户</p>
      <div v-for="item in versionsForm" :key="item.versionDesc">
        <span class="audience-version-name">{{ item.versionName }}</span>
        <el-input
          v-model="item.whitelist"
          clearable
          type="text"
          auto-complete="off"
          placeholder="请输入白名单"
          @input="handleChange"
          @change="handleChange" />
      </div>
      <span
        class="target-audience-err"
        style="margin-top: 20px; display: inline-block;height: 20px"
        >{{ errWhite}}</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup name="target-audience">
  import { getCurrentInstance, nextTick, ref, watch } from 'vue'
  import { getColor } from '../../../utils'
  import type { PropType } from 'vue'
  import type { IAudienceInfo, IVersionInfoItem } from '../../../utils/types'

  const versionsForm = ref<Array<IVersionInfoItem>>([])
  const props = defineProps({
    audience: {
      type: Object as PropType<IAudienceInfo>,
    },
    versions: {
      type: Array as PropType<IVersionInfoItem>,
    },
  })
  /************************ 表单校验相关 ****************************/

  const showErrVer = ref<boolean>(false)
  const errWhite = ref<string>('')
  const reg = /^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$/
  const verFrom = () => {
    let check = true
    showErrVer.value = false
    showErrVer.value = false
    let versionTrafficWeight = 0
    errWhite.value = ''
    let whiteList = []
    versionsForm.value.forEach(val => {
      versionTrafficWeight = (val.versionTrafficWeight * 10 + versionTrafficWeight * 10) / 10
      if(!val.whitelist) return
      // 校验白名单格式
      if (!reg.test(val.whitelist)) {
        check = false
        errWhite.value = '白名单用户填写格式错误，请以英文逗号好分隔，用户名不支持特殊字符'
      }
      // 将所有白名单组合成一个数组，用于后面去重判断是否存在重复
      if (val.whitelist) {
        whiteList = whiteList.concat(val.whitelist.split(','))
      }
    })
    // 校验流量分配
    if (versionTrafficWeight !== 100) {
      showErrVer.value = true
      check = false
    }
    // 校验是否存在重复用户
    const len = whiteList.length
    const setArr = Array.from(new Set([...whiteList]))
    if (len !== setArr.length) {
      errWhite.value = '白名单用户填写格式错误，各版本之间存在相同用户名'
      check = false
    }
    return check
  }

  /************************ 双向绑定相关 ****************************/

  const emit = defineEmits(['update:audience', 'update:versions', 'next'])
  emit('next', true)
  const color = ref([])
  watch(
    () => props.versions,
    () => {
      props.versions && (versionsForm.value = props.versions)
      color.value.length === 0 &&
        versionsForm.value.forEach(() => {
          color.value.push(getColor())
        })
    },
    { deep: true, immediate: true }
  )

  const audienceForm = ref<IAudienceInfo>({})
  watch(
    () => props.audience,
    () => {
      if (props.audience) {
        audienceForm.value = props.audience
        nextTick(() => {
          if (!verFrom()) {
            emit('next', true)
            return
          }
          emit('next', false)
        })
      }
    },
    { deep: true, immediate: true }
  )
  const inst = getCurrentInstance()
  const handleChange = () => {
    console.log(audienceForm.value.experimentTrafficWeight)
    if (!verFrom()) {
      emit('next', true)
      return
    }
    emit('next', false)
    emit('update:audience', audienceForm.value)
    emit('update:versions', versionsForm.value)
    nextTick(() => {
      ;(inst.proxy.$parent as { cacheForm: Function }).cacheForm()
    })
  }


</script>
<style lang="scss">
  .version-flow {
    background-color: #f4f8fa;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
    .version-flow-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.5rem;
      .color-ic {
        width: 0.7rem;
        display: inline-block;
        height: 0.7rem;
        border-radius: 999px;
      }
    }
  }
  .target-audience {
    .audience-version-name {
      font-size: 14px;
      color: #909399;
      line-height: 50px;
    }
    .target-audience-err {
      font-size: 12px;
      color: #f56c6c;
    }
  }
</style>
