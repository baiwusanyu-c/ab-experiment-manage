<template>
  <div class="add-app">
    <el-form
      ref="ruleFormRef"
      :model="form"
      status-icon
      :rules="rules"
      label-width="120px"
      class="add-app-form">
      <el-form-item label="应用名称" prop="appName">
        <el-input
          v-model="form.appName"
          placeholder="请输入应用名称"
          type="text"
          autocomplete="off"
          maxlength="50" />
      </el-form-item>
      <el-form-item label="应用key" prop="appKey">
        <el-input
          v-model="form.appKey"
          type="text"
          placeholder="请输入应用key"
          autocomplete="off"
          maxlength="30" />
      </el-form-item>

      <el-form-item label="应用类型" prop="appType">
        <el-select v-model="form.appType" placeholder="请选择应用类型">
          <el-option label="微信小程序" :value="1" />
          <el-option label="抖音小程序" :value="2" />
          <el-option label="web/H5" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="应用描述" prop="appDesc">
        <el-input v-model="form.appDesc" placeholder="请输入应用描述" type="textarea" rows="4" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" name="app-add" setup>
  // TODO: 应用类型需要接口对接获取数据
  import { getCurrentInstance, ref } from 'vue'
  import { addApplication } from '../../../api/ab-test/ab-test'
  import type { FormInstance } from 'element-plus'
  import type { IAddApp } from '../../../api/ab-test/ab-test'
  import type { IComponentProxy } from '../../../utils/types'
  const proxy = getCurrentInstance()?.proxy
  const ruleFormRef = ref<FormInstance | null>(null)

  const form = ref<IAddApp>({
    appName: '',
    appType: 1,
    appDesc: '',
    appKey: '',
  })
  const rules = ref({
    appName: [
      { required: true, message: '请输入应用名称', trigger: 'blur' },
      { min: 1, max: 50, message: '长度最大支持50个字符', trigger: 'blur' },
    ],
    appType: [{ required: true, message: '请选择应用类型', trigger: 'blur' }],
    appKey: [
      { required: true, message: '请输入应用key', trigger: 'blur' },
      { min: 1, max: 50, message: '长度最大支持30个字符', trigger: 'blur' },
    ],
    appDesc: [{ min: 1, max: 1000, message: '长度最大支持1000个字符', trigger: 'blur' }],
  })
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid: boolean) => {
      if (valid) {
        addApplication(form.value).then(res => {
          if (res) {
            ;(proxy as IComponentProxy).$modal.msgSuccess('创建成功')
          }
        })
      }
    })
  }

  const resetForm = (showMsg = true) => {
    ruleFormRef.value?.resetFields()
    if (showMsg) {
      ;(proxy as IComponentProxy).$modal.msgSuccess('重置成功')
    }
  }
  defineExpose({
    resetForm,
  })
</script>

<style scoped lang="scss">
  .add-app {
    display: flex;
    justify-content: center;
    align-items: center;
    .add-app-form {
      width: 800px;
    }
  }
</style>
