<template>
  <div id="add_app" class="app-container">
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
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
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
  </div>
</template>

<script lang="ts" name="add-app" setup>
  import { getCurrentInstance, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  const { proxy } = getCurrentInstance()
  const ruleFormRef = ref<FormInstance>()
  const form = reactive({
    appName: '',
    appType: '',
    appDesc: '',
    appKey: '',
  })
  const rules = reactive<typeof form>({
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
    await formEl.validate((valid: any, fields: any) => {
      if (valid) {
        proxy.$modal.msgSuccess('创建成功')
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    proxy.$modal.msgSuccess('重置成功')
  }
</script>

<style scoped lang="scss">
  .add-app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    .add-app-form {
      width: 800px;
    }
  }
</style>
