<template>
  <div class="app-container">
    <div class="exp-add-container">
      <el-steps :active="curStep" align-center>
        <el-step title="Step 1 输入实验基本信息" />
        <el-step title="Step 2 设置实验版本" />
        <el-step title="Step 3 设置目标受众" />
      </el-steps>
      <div class="exp-add-form">
        <base-info v-if="curStep === 1" v-model="form.baseInfo" @next="handleCanNext"> </base-info>
        <version-info
          v-if="curStep === 2"
          v-model="form.versions"
          @next="handleCanNext"></version-info>
        <target-audience
          v-if="curStep === 3"
          v-model:versions="form.versions"
          v-model:audience="form.audience"
          @next="handleCanNext">
        </target-audience>
      </div>
      <div class="exp-btn-group">
        <el-button v-show="curStep !== 1" type="primary" @click="prevStep">上一步</el-button>
        <el-button v-show="curStep !== 3" :disabled="isCanNext" type="primary" @click="nextStep"
          >下一步</el-button
        >
        <el-button v-show="curStep === 3" :disabled="isCanNext" type="primary" @click="handleSubmit"
          >提交</el-button
        >
        <el-button icon="Refresh" @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="experiment-add-edit">
  import { getCurrentInstance, nextTick, ref } from 'vue'
  import cache from '../../../plugins/cache'
  import BaseInfo from './base-info.vue'
  import VersionInfo from './version-info.vue'
  import TargetAudience from './target-audience.vue'
  import type { IComponentProxy, IExpAddEditModel } from '../../../utils/types'

  const inst = getCurrentInstance()
  const form = ref<IExpAddEditModel>({})
  const curStep = ref(2)
  const nextStep = () => {
    curStep.value++
  }
  const prevStep = () => {
    curStep.value--
  }
  const handleSubmit = () => {
    console.log(form)
  }
  const handleCancel = () => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`取消后将不会保存您填写的信息，是否要取消？`)
      .then(() => {
        resetForm()
        nextTick(() => {
          location.reload()
        })
      })
      .catch(err => {
        console.error(err)
      })
  }
  const resetForm = () => {
    cache.session.remove('expAddEditForm')
    form.value = {}
  }
  // 缓存表单
  const cacheForm = () => {
    cache.session.setJSON('expAddEditForm', form.value)
  }
  // 获取缓存表单数据
  const getCacheFrom = () => {
    return cache.session.getJSON('expAddEditForm')
  }
  defineExpose({
    cacheForm,
  })
  const init = () => {
    const cacheData = getCacheFrom()
    if (cacheData) {
      form.value = cacheData
    }
  }
  init()
  const isCanNext = ref<boolean>(false)
  const handleCanNext = (next: boolean) => {
    isCanNext.value = next
  }
</script>
<style lang="scss">
  .exp-add-container {
    width: 50rem;
    margin: 0 auto;
  }
  .exp-btn-group {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .exp-add-form {
    margin: 6rem 0;
  }
</style>
