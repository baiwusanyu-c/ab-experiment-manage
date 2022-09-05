import { parseTime } from '../utils/ruoyi'

export const useAbtest = () => {
  const handleDateArr = (params: any) => {
    if (params.dateArr?.length > 0) {
      params.startTime = parseTime(params.dateArr[0])
      params.endTime = parseTime(params.dateArr[1])
    }else{
      params.startTime = ''
      params.endTime = ''
    }
    return params
  }
  return {
    handleDateArr,
  }
}
