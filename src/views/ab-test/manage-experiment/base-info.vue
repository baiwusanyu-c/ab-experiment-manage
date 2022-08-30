<template>
  <div class="base-info">
    <el-form
      ref="ruleFormRef"
      :model="baseInfoForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="add-app-form">
      <el-form-item label="实验名称" prop="experimentName">
        <el-input
          v-model="baseInfoForm.experimentName"
          placeholder="请输入实验名称"
          type="text"
          autocomplete="off"
          maxlength="50"
          @change="handleChange" />
      </el-form-item>
      <el-form-item label="实验ID" prop="experimentKey">
        <el-input
          v-model="baseInfoForm.experimentKey"
          placeholder="请输入实验ID"
          type="text"
          autocomplete="off"
          maxlength="100"
          @change="handleChange" />
      </el-form-item>
      <el-form-item label="实验描述" prop="experimentDesc">
        <el-input
          v-model="baseInfoForm.experimentDesc"
          placeholder="请输入实验描述"
          type="textarea"
          rows="4"
          @change="handleChange" />
      </el-form-item>
      <el-form-item label="所属应用" prop="appId">
        <el-select v-model="baseInfoForm.appId" placeholder="请选择所属应用" @change="handleChange">
          <el-option
            v-for="item in appList"
            :key="item.appId + item.appName"
            :label="item.appName"
            :value="item.appId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="实验类型" prop="experimentType">
        <el-radio-group v-model="baseInfoForm.experimentType" class="ml-4" @change="handleChange">
          <el-radio :label="1" size="large">客户端</el-radio>
          <el-radio :label="2" size="large">服务端</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运行时间" prop="dateArr">
        <el-date-picker
          v-model="baseInfoForm.dateArr"
          type="datetimerange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleChange"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="base-info">
  import { getCurrentInstance, nextTick, ref, watch } from 'vue'
  import { listApplication } from '../../../api/ab-test/ab-test'
  import type { PropType } from 'vue'
  import type { IExpBaseInfo } from '../../../utils/types'
  const { proxy } = getCurrentInstance()
  const baseInfoForm = ref<IExpBaseInfo>({
    experimentType: 1,
  })
  const rules = ref({
    experimentName: [
      { required: true, message: '请输入实验名称', trigger: 'blur' },
      { min: 1, max: 50, message: '长度最大支持50个字符', trigger: 'blur' },
    ],
    experimentKey: [
      { required: true, message: '请输入实验ID', trigger: 'blur' },
      { min: 1, max: 100, message: '长度最大支持100个字符', trigger: 'blur' },
    ],
    experimentDesc: [{ min: 1, max: 1000, message: '长度最大支持1000个字符', trigger: 'blur' }],
    appId: [{ required: true, message: '请选择所属应用', trigger: 'blur' }],
    experimentType: [{ required: true, message: '请选择实验类型', trigger: 'blur' }],
    dateArr: [{ required: true, message: '请选择运行时间', trigger: 'blur' }],
  })
  const props = defineProps({
    modelValue: {
      type: Object as PropType<IExpBaseInfo>,
    },
  })
  const emit = defineEmits(['update:modelValue'])
  const handleChange = () => {
    emit('update:modelValue', baseInfoForm.value)
    nextTick(() => {
      ;(proxy.$parent as { cacheForm: Function }).cacheForm()
    })
  }
  watch(
    () => props.modelValue,
    () => {
      props.modelValue && (baseInfoForm.value = props.modelValue)
    },
    { deep: true, immediate: true }
  )

  const appList = ref([])
  const getList = () => {
    listApplication({}).then((res: any) => {
      if (res) {
        appList.value = res.data
      }
    })
  }
  getList()
</script>
