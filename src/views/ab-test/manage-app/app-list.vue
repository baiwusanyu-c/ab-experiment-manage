<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item label="应用名称" prop="appName">
        <el-input
          v-model="queryParams.appName"
          placeholder="请输入应用名称"
          clearable
          maxlength="50"
          style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="应用ID" prop="appID">
        <el-input
          v-model="queryParams.appID"
          placeholder="请输入应用ID"
          clearable
          maxlength="30"
          style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="appList">
      <el-table-column type="index" width="50" />
      <el-table-column label="应用名称" prop="roleId" width="120" />
      <el-table-column label="应用ID" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="App Name" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="应用类型" prop="roleSort" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-hasPermi="['system:role:edit']"
              type="text"
              icon="Edit"
              @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDialog" :title="titleDialog" width="800px" append-to-body>
      <app-add-edit ref="appAddEdit" :type="typeDialog" @close="closeDialog"> </app-add-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="app-list" setup>
  // TODO:搜索字段对接
  // TODO:应用列表字段对接
  // TODO: 应用编辑接口对接
  // TODO: 应用编辑逻辑编写
  import { getCurrentInstance, nextTick, ref } from 'vue'
  import { listApplication } from '../../../api/ab-test/ab-test'
  import AppAddEdit from './app-add-edit.vue'
  import type { ComponentPublicInstance } from 'vue'
  import type { IComponentProxy, IQueryParams } from '../../../utils/types'
  interface IAppAddEdit extends ComponentPublicInstance {
    appAddEdit: {
      resetForm: Function
    }
  }
  const inst = getCurrentInstance()
  /********************* 搜索相关逻辑 *******************************/

  const showSearch = ref<boolean>(true)
  const queryParams = ref<IQueryParams>({
    pageNo: 1,
    pageSize: 10,
  })

  const handleQuery = () => {
    queryParams.value.pageNo = 1
    getList()
  }

  const resetQuery = () => {
    ;(inst?.proxy as IComponentProxy).resetForm('queryRef')
    handleQuery()
  }
  /********************* 新增、编辑相关逻辑 *******************************/

  const showDialog = ref<boolean>(false)
  const titleDialog = ref<string>('')
  const typeDialog = ref<string>('add')
  const handleAdd = () => {
    titleDialog.value = '新增应用'
    typeDialog.value = 'add'
    showDialog.value = true
    nextTick(() => {
      ;(inst?.refs as unknown as IAppAddEdit).appAddEdit.resetForm(false)
    })
  }

  const handleEdit = (row: any) => {
    titleDialog.value = '编辑应用'
    typeDialog.value = 'edit'
    showDialog.value = true
    console.info(row)
  }
  const closeDialog = () => {
    showDialog.value = false
  }
  defineExpose({
    closeDialog,
  })
  /************************ 获取列表相关 ****************************/

  const appList = ref([])
  const loading = ref<boolean>(false)
  const getList = () => {
    loading.value = true
    listApplication()
      .then((res: any) => {
        if (res) {
          appList.value = res
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>

<style scoped></style>
