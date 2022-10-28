<template>
  <div class="app-container">
    <div class="exp-add-container">
      <el-steps :active="curStep" align-center>
        <el-step title="Step 1 输入实验基本信息" />
        <el-step title="Step 2 设置实验版本" />
        <el-step title="Step 3 设置目标受众" />
      </el-steps>
      <div class="exp-add-form">
        <base-info
          v-if="curStep === 1"
          v-model="form.baseInfo"
          :is-edit="isEdit"
          @next="handleCanNext">
        </base-info>
        <version-info
          v-if="curStep === 2"
          v-model="form.versions"
          :is-edit="isEdit"
          @next="handleCanNext"></version-info>
        <target-audience
          v-if="curStep === 3"
          v-model:versions="form.versions"
          v-model:audience="form.audience"
          :has-label-data="form.labelData ? 2 : 1"
          :is-edit="isEdit"
          @next="handleCanNext">
        </target-audience>
      </div>
      <div class="exp-btn-group">
        <el-button v-show="curStep !== 1" type="primary" @click="nextOrPrev(curStep - 1)"
          >上一步</el-button
        >
        <el-button
          v-show="curStep !== 3"
          :disabled="isCanNext"
          type="primary"
          @click="nextOrPrev(curStep + 1)"
          >下一步</el-button
        >
        <el-button v-show="curStep === 3" :disabled="isCanNext" type="primary" @click="handleSubmit"
          >提交</el-button
        >
        <el-button v-if="isEdit === 'false'" icon="Refresh" @click="handleCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="experiment-add-edit">
  // TODO: 锁定字段确定放在哪个表单（等待接口设计）
  // TODO: 锁定字段接口对接
  // TODO: 测试服务端实验字段是否提交成功
  // TODO: 确定筛选表单设计（等待接口设计）
  import { getCurrentInstance, nextTick, ref } from 'vue'
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import cache from '../../../plugins/cache'
  import { createExperiment, detailExperiment, editExperiment } from '../../../api/ab-test/ab-test'
  import { useAbtest } from '../../../hook/use-abtest'
  import { useLabelNameOption } from '../../../store/modules/filter-item'
  import store from '../../../store'
  import BaseInfo from './base-info.vue'
  import VersionInfo from './version-info.vue'
  import TargetAudience from './target-audience.vue'
  import type { IComponentProxy, IExpAddEditModel } from '../../../utils/types'
  const inst = getCurrentInstance()?.proxy
  const form = ref<IExpAddEditModel>({})
  const curStep = ref(1)
  // 下一步、提交按钮限制
  const isCanNext = ref<boolean>(false)
  const handleCanNext = (next: boolean) => {
    isCanNext.value = next
  }

  /************************ 表单缓存、提交、取消 ****************************/

  const router = useRouter()
  const { handleDateArr } = useAbtest()
  const { getFilterItemFrom, setFilterItemFrom } = useLabelNameOption(store)
  const handleSubmit = () => {
    form.value.labelData = JSON.stringify(getFilterItemFrom())
    let params = {
      ...form.value.baseInfo,
      ...form.value.audience,
      versions: form.value.versions,
      labelData: form.value.labelData,
    }
    params = handleDateArr(params)
    if (route.query.isEdit) {
      editExperiment(params).then(res => {
        if (res) {
          submitSuccess('更新成功', '/ab-exp/manage-experiment/experiment-edit')
        }
      })
    } else {
      createExperiment(params).then(res => {
        if (res) {
          submitSuccess('创建成功', '/ab-exp/manage-experiment/experiment-add')
        }
      })
    }
  }

  const submitSuccess = (msg: string, path: string) => {
    ;(inst! as IComponentProxy).$modal.msgSuccess(msg)
    handleCancel(false)
    ;(inst! as IComponentProxy).$tab.closePage({ path })
    router.push('/ab-exp/manage-experiment/experiment-list')
  }

  const handleCancel = (isReload = true) => {
    if (!isReload) {
      resetForm()
      return
    }
    ;(inst! as IComponentProxy).$modal
      .confirm(`取消后将不会保存您填写的信息，是否要取消？`)
      .then(() => {
        resetForm()
        nextTick(() => {
          location.reload()
        })
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  const resetForm = () => {
    cache.session.remove('expAddEditForm')
    cache.session.remove('curStep')
    form.value = {}
  }

  onBeforeRouteLeave(() => {
    resetForm()
  })

  // 缓存表单
  const cacheForm = () => {
    cache.session.setJSON('expAddEditForm', form.value)
  }

  const nextOrPrev = (step: number) => {
    curStep.value = step
    cache.session.setJSON('curStep', curStep.value)
  }

  // 获取缓存表单数据
  const getCacheFrom = () => {
    const form = cache.session.getJSON('expAddEditForm')
    const curStep = cache.session.getJSON('curStep')
    return {
      form,
      curStep,
    }
  }

  defineExpose({
    cacheForm,
  })

  /************************ 获取列表相关 ****************************/

  const route = useRoute()
  const expId = ref<string>('')
  const isEdit = ref<string>('false')
  const getExpDetail = () => {
    detailExperiment({ experimentId: expId.value }).then(res => {
      form.value.versions = res.data.versions
      const baseInfo = {
        ...res.data,
        dateArr: [res.data.startTime, res.data.endTime],
      }
      Reflect.deleteProperty(baseInfo, 'versions')
      form.value.baseInfo = baseInfo
      form.value.audience = {
        experimentTrafficWeight: res.data.experimentTrafficWeight,
      }
      // TODO: labelData 字段数据回填,由于有第三层组件，这里使用 pinia
      // form.value.labelData = res.data.labelData
      // setFilterItemFrom(JSON.parse(res.data.labelData))
      const mock = {
        relation: 'and',
        filters: [
          {
            relation: 'and',
            conditions: [
              { labelId: '1', function: 'equal', params: ['成都'] },
              { labelId: '1', function: 'valuable', params: [] },
            ],
          },
        ],
        conditions: [{ labelId: '1', function: 'equal', params: ['北京', '成都'] }],
      }
      form.value.labelData = JSON.stringify(mock)
      setFilterItemFrom(mock)
    })
  }

  const init = () => {
    isEdit.value = 'false'
    expId.value = ''
    const cacheData = getCacheFrom()
    if (route.query.isEdit && !cacheData.form) {
      isEdit.value = route.query.isEdit as string
      expId.value = route.query.expId as string
      getExpDetail()
    } else {
      const cacheData = getCacheFrom()
      if (cacheData.form) {
        form.value = cacheData.form
      }
      if (cacheData.curStep) {
        curStep.value = Number(cacheData.curStep)
      }
    }
  }
  init()
</script>
<style lang="scss">
  .exp-add-container {
    width: 57rem;
    margin: 0 auto;
  }
  .exp-btn-group {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .exp-add-form {
    margin: 4rem 0;
  }
</style>
