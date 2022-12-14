import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import '../src/assets/styles/index.scss' // global css

// 注册指令

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '../src/components/SvgIcon/index.vue'
import elementIcons from '../src/components/SvgIcon/svgicon'

import './permission' // permission control

// 分页组件
import Pagination from '../src/components/Pagination/index.vue'
// 自定义表格工具组件
import RightToolbar from '../src/components/RightToolbar/index.vue'
// 文件上传组件
import FileUpload from '../src/components/FileUpload/index.vue'
// 图片上传组件
import ImageUpload from '../src/components/ImageUpload/index.vue'
// 图片预览组件
import ImagePreview from '../src/components/ImagePreview/index.vue'
// 自定义树选择组件
import TreeSelect from '../src/components/TreeSelect/index.vue'
// 字典标签组件
import DictTag from '../src/components/DictTag/index.vue'
import {
  addDateRange,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictLabels,
} from './utils/ruoyi'
import { useDict } from './utils/dict'
import { download } from './utils/request'
import plugins from './plugins' // plugins
import directive from './directive/index' // directive
import router from './router'
import store from './store'
import App from './App.vue'

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('SvgIcon', SvgIcon)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default',
})

app.mount('#app')
