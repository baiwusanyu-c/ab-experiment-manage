<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item label="应用名称" prop="searchValue">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入应用名称"
          clearable
          maxlength="50"
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
      <el-table-column label="应用名称" prop="appName" show-overflow-tooltip />
      <el-table-column label="应用ID" prop="appId" show-overflow-tooltip width="150" />
      <el-table-column label="App Key" prop="appKey" show-overflow-tooltip />
      <el-table-column label="应用类型" prop="appType">
        <template #default="scope">
          <span>{{ getOptionVal(appType, scope.row.appType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <span v-hasPermi="['system:role:edit']" class="op-btn" @click="handleEdit(scope.row)"
            >编辑</span
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="showDialog"
      :title="titleDialog"
      width="800px"
      append-to-body
      @close="closeDialog">
      <app-add-edit ref="appAddEdit" :type="typeDialog" :app-id="curAppId"> </app-add-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts" name="app-list" setup>
  // TODO: 搜索字段对接 complete
  // TODO: 应用列表字段对接 complete

  // TODO: 应用编辑接口对接
  // TODO: 应用编辑逻辑编写

  // TODO: 应用详情接口对接
  // TODO: 应用详情逻辑编写
  import { computed, getCurrentInstance, nextTick, ref } from 'vue'
  import { useEventBus } from '@vueuse/core'
  import { listApplication } from '../../../api/ab-test/ab-test'
  import useCommonParamsStore from '../../../store/modules/common-params'
  import store from '../../../store'
  import AppAddEdit from './app-add-edit.vue'
  import type { IAppType } from '../../../store/modules/common-params'
  import type { ComponentPublicInstance } from 'vue'
  import type { IAppQueryParams, IComponentProxy } from '../../../utils/types'
  interface IAppAddEdit extends ComponentPublicInstance {
    appAddEdit: {
      resetForm: Function
    }
  }
  const inst = getCurrentInstance()
  /********************* 搜索相关逻辑 *******************************/

  const showSearch = ref<boolean>(true)
  const queryParams = ref<IAppQueryParams>({})

  const handleQuery = () => {
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
  const curAppId = ref<string>('')
  const handleEdit = (row: any) => {
    titleDialog.value = '编辑应用'
    typeDialog.value = 'edit'
    showDialog.value = true
    nextTick(() => {
      ;(inst?.refs as unknown as IAppAddEdit).appAddEdit.resetForm(false)
      curAppId.value = row.appId
    })
  }
  const closeDialog = () => {
    showDialog.value = false
    curAppId.value = ''
  }
  defineExpose({
    closeDialog,
  })
  /************************ 获取公共参数相关 ****************************/

  const appType = ref<IAppType>({
    1: '',
    2: '',
    3: '',
  })
  const bus = useEventBus<string>('commonParams')
  const setCommonParams = () => {
    appType.value = useCommonParamsStore(store).getParams('APP_TYPE')
  }
  bus.on(setCommonParams)
  setCommonParams()

  const getOptionVal = computed(() => {
    return function (data, key) {
      if (key && data) {
        return data[key]
      }
      return ''
    }
  })
  /************************ 获取列表相关 ****************************/

  const appList = ref([])
  const loading = ref<boolean>(false)
  const getList = () => {
    loading.value = true
    listApplication(queryParams.value)
      .then((res: any) => {
        if (res) {
          appList.value = res.data
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  getList()
</script>

<style scoped></style>
