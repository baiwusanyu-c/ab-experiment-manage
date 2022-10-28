<template>
  <div class="target-audience">
    <p class="ta-title">选择受众用户</p>
    <el-radio-group v-model="showFilter" class="ml-4">
      <el-radio :label="1" size="large">全部用户</el-radio>
      <el-radio :label="2" size="large">受众用户筛选</el-radio>
    </el-radio-group>
    <label-filter-from v-if="showFilter === 2" @next="handleEmitEvt"></label-filter-from>

    <p class="ta-title">实验流量分配 (%)</p>
    <el-slider
      v-model="audienceForm.experimentTrafficWeight"
      show-input
      :step="0.1"
      @change="handleChange" />
    <p class="ta-title">版本流量分配 (%)</p>
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

    <!--  TODO: 服务端条件渲染  -->
    <p class="ta-title">实验版本锁定</p>
    <el-radio-group v-model="test" class="ml-4">
      <el-radio :label="1" size="large">不锁定实验版本</el-radio>
      <el-radio :label="2" size="large">锁定实验版本</el-radio>
    </el-radio-group>
    <p v-show="test === 1" class="description-txt">服务端用户进组会出组，流量变更后用户可能跳组</p>
    <p v-show="test === 2" class="description-txt">
      服务端用户进组不会出组，流量变更后对以分组用户不会影响
    </p>

    <p class="ta-title">添加白名单用户</p>
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
      style="margin-top: 20px; display: inline-block; height: 20px"
      >{{ errWhite }}</span
    >
  </div>
</template>

<script lang="ts" setup name="target-audience">
  import { getCurrentInstance, nextTick, ref, watch } from 'vue'
  import randomColor from 'randomcolor'
  import LabelFilterFrom from './label-filter-from.vue'
  import type { PropType } from 'vue'
  import type { IAudienceInfo, IComponentProxy, IVersionInfoItem } from '../../../utils/types'

  const versionsForm = ref<Array<IVersionInfoItem>>([])
  const props = defineProps({
    audience: {
      type: Object as PropType<IAudienceInfo>,
    },
    versions: {
      type: Array as unknown as PropType<IVersionInfoItem>,
    },
    isEdit: {
      type: String,
      default: '',
    },
  })

  const showFilter = ref<number>(1)
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
    let whiteList: Array<string> = []
    versionsForm.value.forEach(val => {
      versionTrafficWeight = (val.versionTrafficWeight! * 10 + versionTrafficWeight * 10) / 10
      if (!val.whitelist) return
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
  const handleEmitEvt = (val: boolean) => {
    emit('next', val)
  }
  handleEmitEvt(true)
  const color = ref<Array<string>>([])
  watch(
    () => props.versions,
    () => {
      // @ts-ignore
      props.versions && (versionsForm.value = props.versions)
      color.value.length === 0 &&
        versionsForm.value.forEach(() => {
          color.value.push(randomColor())
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
            handleEmitEvt(true)
            return
          }
          handleEmitEvt(false)
        })
      }
    },
    { deep: true, immediate: true }
  )
  const proxy = getCurrentInstance()?.proxy
  const handleChange = () => {
    if (!verFrom()) {
      handleEmitEvt(true)
      return
    }
    handleEmitEvt(false)
    emit('update:audience', audienceForm.value)
    emit('update:versions', versionsForm.value)
    nextTick(() => {
      ;(proxy!.$parent as IComponentProxy).cacheForm()
    })
  }

  const test = ref(1)
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
    .ta-title {
      font-size: 16px;
      font-weight: bold;
    }
    .audience-version-name {
      font-size: 14px;
      color: #909399;
      line-height: 50px;
    }
    .target-audience-err {
      font-size: 12px;
      color: #f56c6c;
    }
    .description-txt {
      color: #a8abb2;
      font-size: 14px;
    }
  }
</style>
