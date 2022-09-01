import { parseTime } from "../utils/ruoyi";

export const useAbtest = () =>{
  const handleDateArr = (params:any) =>{
    if (params.dateArr?.length > 0) {
      params.startTime = parseTime(params.dateArr[0])
      params.endTime = parseTime(params.dateArr[1])
    }
    Reflect.deleteProperty(params, 'dateArr')
    return params
  }
  return {
    handleDateArr
  }
}
