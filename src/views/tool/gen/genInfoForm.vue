<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="tplCategory">
          <template #label>生成模板</template>
          <el-select v-model="modelValueInner.tplCategory" @change="tplSelectChange">
            <el-option label="单表（增删改查）" value="crud" />
            <el-option label="树表（增删改查）" value="tree" />
            <el-option label="主子表（增删改查）" value="sub" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="packageName">
          <template #label>
            生成包路径
            <el-tooltip content="生成在哪个java包下，例如 com.ruoyi.system" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="modelValueInner.packageName" @change="handleChange" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <template #label>
            生成模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="modelValueInner.moduleName" @change="handleChange" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="businessName">
          <template #label>
            生成业务名
            <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="modelValueInner.businessName" @change="handleChange" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="functionName">
          <template #label>
            生成功能名
            <el-tooltip content="用作类描述，例如 用户" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="modelValueInner.functionName" @change="handleChange" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item>
          <template #label>
            上级菜单
            <el-tooltip content="分配到指定菜单下，例如 系统管理" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <tree-select
            v-model:value="modelValueInner.parentMenuId"
            :options="menuOptions"
            :obj-map="{ value: 'menuId', label: 'menuName', children: 'children' }"
            placeholder="请选择系统菜单"
            @change="handleChange" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="genType">
          <template #label>
            生成代码方式
            <el-tooltip content="默认为zip压缩包下载，也可以自定义生成路径" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-radio v-model="modelValueInner.genType" label="0" @change="handleChange"
            >zip压缩包</el-radio
          >
          <el-radio v-model="modelValueInner.genType" label="1" @change="handleChange"
            >自定义路径</el-radio
          >
        </el-form-item>
      </el-col>

      <el-col v-if="modelValueInner.genType == '1'" :span="24">
        <el-form-item prop="genPath">
          <template #label>
            自定义路径
            <el-tooltip content="填写磁盘绝对路径，若不填写，则生成到当前Web项目下" placement="top">
              <el-icon><question-filled /></el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="modelValueInner.genPath">
            <template #append>
              <el-dropdown>
                <el-button type="primary">
                  最近路径快速选择
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDropClick"
                      >恢复默认的生成基础路径</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <template v-if="modelValueInner.tplCategory === 'tree'">
      <h4 class="form-header">其他信息</h4>
      <el-row v-show="modelValueInner.tplCategory === 'tree'">
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树编码字段
              <el-tooltip content="树显示的编码字段名， 如：dept_id" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="modelValueInner.treeCode"
              placeholder="请选择"
              @change="handleChange">
              <el-option
                v-for="(column, index) in modelValueInner.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树父编码字段
              <el-tooltip content="树显示的父编码字段名， 如：parent_Id" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="modelValueInner.treeParentCode"
              placeholder="请选择"
              @change="handleChange">
              <el-option
                v-for="(column, index) in modelValueInner.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              树名称字段
              <el-tooltip content="树节点的显示名称字段名， 如：dept_name" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="modelValueInner.treeName"
              placeholder="请选择"
              @change="handleChange">
              <el-option
                v-for="(column, index) in modelValueInner.columns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-if="modelValueInner.tplCategory === 'sub'">
      <h4 class="form-header">关联信息</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              关联子表的表名
              <el-tooltip content="关联子表的表名， 如：sys_user" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="modelValueInner.subTableName"
              placeholder="请选择"
              @change="subSelectChange">
              <el-option
                v-for="(table, index) in tables"
                :key="index"
                :label="table.tableName + '：' + table.tableComment"
                :value="table.tableName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <template #label>
              子表关联的外键名
              <el-tooltip content="子表关联的外键名， 如：user_id" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="modelValueInner.subTableFkName"
              placeholder="请选择"
              @change="handleChange">
              <el-option
                v-for="(column, index) in subColumns"
                :key="index"
                :label="column.columnName + '：' + column.columnComment"
                :value="column.columnName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
  </el-form>
</template>

<script setup lang="ts" name="genInfoForm">
  import { getCurrentInstance, ref, watch } from 'vue'

  import { listMenu } from '../../../api/system/menu'
  import type { PropType } from 'vue'
  interface IGenInfoForm {
    tplCategory?: string
    packageName?: string
    moduleName?: string
    businessName?: string
    functionName?: string
    parentMenuId?: number
    genType?: string
    genPath?: string
    treeCode?: number
    columns?: Array<any>
    treeParentCode?: number
    treeName?: string
    subTableName?: string
    subTableFkName?: string
  }
  interface IGenInfoTable {
    columns: Array<any>
    tableName: string
  }
  interface IGenInfoFormInst {
    proxy?: any
  }
  const modelValueInner = ref<IGenInfoForm>({})
  const subColumns = ref<Array<any>>([])
  const menuOptions = ref({})
  const { proxy } = getCurrentInstance() as IGenInfoFormInst

  const props = defineProps({
    info: {
      type: Object as PropType<IGenInfoForm>,
    },
    tables: {
      type: Array as PropType<Array<IGenInfoTable>>,
    },
  })
  watch(
    () => props.info,
    () => {
      props.info && (modelValueInner.value = props.info)
    },
    { deep: true, immediate: true }
  )
  // 表单校验
  const rules = ref({
    tplCategory: [{ required: true, message: '请选择生成模板', trigger: 'blur' }],
    packageName: [{ required: true, message: '请输入生成包路径', trigger: 'blur' }],
    moduleName: [{ required: true, message: '请输入生成模块名', trigger: 'blur' }],
    businessName: [{ required: true, message: '请输入生成业务名', trigger: 'blur' }],
    functionName: [{ required: true, message: '请输入生成功能名', trigger: 'blur' }],
  })
  const emit = defineEmits(['update:info'])
  const handleChange = (): void => {
    emit('update:info', modelValueInner.value)
  }
  function subSelectChange() {
    modelValueInner.value.subTableFkName = ''
    handleChange()
  }
  function tplSelectChange(value: string) {
    if (value !== 'sub') {
      modelValueInner.value.subTableName = ''
      modelValueInner.value.subTableFkName = ''
      handleChange()
    }
  }
  function setSubTableColumns(value: string) {
    for (const item in props.tables) {
      const itemTables = props.tables[item as keyof typeof props.tables] as IGenInfoTable
      const name = itemTables.tableName
      if (value === name) {
        subColumns.value = itemTables.columns
        break
      }
    }
  }
  /** 查询菜单下拉树结构 */
  function getMenuTreeselect() {
    listMenu().then((response: { data: any }) => {
      menuOptions.value = proxy.handleTree(response.data, 'menuId')
    })
  }

  watch(
    () => props.info && props.info.subTableName,
    val => {
      if (val) {
        setSubTableColumns(val)
      }
    }
  )
  const handleDropClick = () => {
    modelValueInner.value.genPath = '/'
    handleChange()
  }
  getMenuTreeselect()
</script>
