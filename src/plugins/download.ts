import axios from 'axios'
import { ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import { getToken } from '../utils/auth'
import errorCode from '../utils/errorCode'
import { blobValidate } from '../utils/ruoyi'
import type FileSaver from 'file-saver'

const baseURL = import.meta.env.VITE_APP_BASE_API

export default {
  name(name: string, isDelete = true) {
    const url = `${baseURL}/common/download?fileName=${encodeURI(name)}&delete=${isDelete}`
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURI(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  resource(resource: string) {
    const url = `${baseURL}/common/download/resource?resource=${encodeURI(resource)}`
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, decodeURI(res.headers['download-filename']))
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  zip(url: string, name: string) {
    const urlRes = baseURL + url
    axios({
      method: 'get',
      url: urlRes,
      responseType: 'blob',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, name)
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  saveAs(text: string, name: string, opts: FileSaver.FileSaverOptions) {
    saveAs(text, name, opts)
  },
  async printErrMsg(data: any) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg =
      errorCode[rspObj.code as keyof typeof errorCode] || rspObj.msg || errorCode['default']
    ElMessage.error(errMsg)
  },
}
