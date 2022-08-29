<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item label="实验名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入实验名称"
          clearable
          maxlength="50"
          style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="实验状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择应用类型">
          <el-option
            v-for="item in expStatusList"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行时间" prop="dateArr">
        <el-date-picker
          v-model="queryParams.dateArr"
          type="datetimerange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"></el-date-picker>
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
    <el-table v-loading="loading" :data="expList">
      <el-table-column type="index" width="50" />
      <el-table-column label="实验名称" prop="experimentName" show-overflow-tooltip />
      <el-table-column label="所属应用" prop="appName" show-overflow-tooltip />
      <el-table-column label="实验类型" prop="experimentType" width="100">
        <template #default="scope">
          <span>{{ expType[scope.row.experimentType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实验状态" prop="experimentStatus" width="100">
        <template #default="scope">
          <span>{{ expStatus[scope.row.experimentStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流量分配" prop="experimentTrafficWeight" width="100">
        <template #default="scope">
          <span>{{ toPrecision(scope.row.experimentTrafficWeight * 100, 2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
    <!--    <el-dialog v-model="showDialog" :title="titleDialog" width="800px" append-to-body>
      <app-add-edit ref="appAddEdit" :type="typeDialog" @close="closeDialog"> </app-add-edit>
    </el-dialog>-->
  </div>
</template>

<script lang="ts" name="experiment-list" setup>
  // TODO: 搜索字段对接
  // TODO: 实验列表字段对接
  // TODO: 实验新增接口对接
  // TODO: 实验新增逻辑编写
  // TODO: 实验编辑接口对接
  // TODO: 实验编辑逻辑编写
  import { getCurrentInstance, nextTick, ref } from 'vue'
  import { listExperiment } from '../../../api/ab-test/ab-test'
  // import AppAddEdit from './app-add-edit.vue'
  import useCommonParamsStore from '../../../store/modules/common-params'
  import { toPrecision } from '../../../utils/ruoyi'
  import type { ComponentPublicInstance } from 'vue'
  import type { IComponentProxy, IExpData, IExpQueryParams } from '../../../utils/types'
  interface IAppAddEdit extends ComponentPublicInstance {
    appAddEdit: {
      resetForm: Function
    }
  }
  const inst = getCurrentInstance()
  /********************* 搜索相关逻辑 *******************************/
  const expStatusList = useCommonParamsStore().createOption('EXPERIMENT_STATUS')
  const showSearch = ref<boolean>(true)
  const queryParams = ref<IExpQueryParams>({
    pageNo: 1,
    pageSize: 10,
    keyword: '',
    status: 1,
    startTime: '',
    endTime: '',
    dateArr: [],
  })

  const handleQuery = () => {
    if (queryParams.value.dateArr?.length > 0) {
      queryParams.value.startTime = queryParams.value.dateArr[0].toDateString()
      queryParams.value.endTime = queryParams.value.dateArr[1].toDateString()
    }
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

  const expList = ref<Array<IExpData>>([
    {
      experimentId: 'string',
      experimentName: '示例实验1998',
      appName: '实例应用微信小程序',
      experimentType: 1,
      experimentStatus: 2,
      startTime: '2022-8-10 10:10:00',
      endTime: '2077-11-10 10:10:00',
      experimentTrafficWeight: 0.5666,
      createTime: '2022-8-10 10:10:00',
    },
  ])
  const loading = ref<boolean>(false)
  //const expStatus = useCommonParamsStore().getParams('EXPERIMENT_STATUS')
  //const expType = useCommonParamsStore().getParams('EXPERIMENT_TYPE')
  //console.log(expType)
  const getList = () => {
    loading.value = true
    listExperiment(queryParams.value)
      .then((res: any) => {
        if (res) {
          expList.value = res
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>

<style scoped></style>
