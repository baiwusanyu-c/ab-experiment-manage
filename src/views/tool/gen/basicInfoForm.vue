<template>
  <el-form ref="basicInfoForm" :model="modelValueInner" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="modelValueInner.tableName"
            placeholder="请输入仓库名称"
            @change="handleChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            v-model="modelValueInner.tableComment"
            placeholder="请输入"
            @change="handleChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实体类名称" prop="className">
          <el-input
            v-model="modelValueInner.className"
            placeholder="请输入"
            @change="handleChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="functionAuthor">
          <el-input
            v-model="modelValueInner.functionAuthor"
            placeholder="请输入"
            @change="handleChange" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="modelValueInner.remark"
            type="textarea"
            :rows="3"
            @change="handleChange"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts" name="basicInfoForm">
  import { ref, watch } from 'vue'
  import type { PropType } from 'vue'

  interface IBaseInfoForm {
    tableName: string
    tableComment: string
    className: string
    functionAuthor: string
    remark: string
  }
  const props = defineProps({
    info: {
      type: Object as PropType<IBaseInfoForm>,
    },
  })
  const modelValueInner = ref<IBaseInfoForm>({
    tableName: '',
    tableComment: '',
    className: '',
    functionAuthor: '',
    remark: '',
  })
  watch(
    () => props.info,
    () => {
      props.info && (modelValueInner.value = props.info)
    },
    { deep: true, immediate: true }
  )
  const emit = defineEmits(['update:info'])
  const handleChange = (): void => {
    emit('update:info', modelValueInner.value)
  }
  // 表单校验
  const rules = ref({
    tableName: [{ required: true, message: '请输入表名称', trigger: 'blur' }],
    tableComment: [{ required: true, message: '请输入表描述', trigger: 'blur' }],
    className: [{ required: true, message: '请输入实体类名称', trigger: 'blur' }],
    functionAuthor: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  })
</script>
