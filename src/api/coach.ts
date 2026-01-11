import request from '@/utils/request'
import {
  ApiResponse,
  PaginationResponse,
  CoachDetailInfo,
  CoachListItem,
  CoachQueryParams,
  SetScheduleRequest,
  CoachSchedule,
} from '@/types'

// 教练注册初始化
export const coachInit = (): Promise<ApiResponse<any>> => {
  return request.post('/coach/registration/init')
}

// 教练注册
export const coachRegister = (data: any): Promise<ApiResponse<string>> => {
  return request.post('/coach/registration/register', data)
}

// 查询教练详情
export const getCoachDetail = (coachId: string): Promise<ApiResponse<CoachDetailInfo>> => {
  return request.post('/coach/queryDetail', { coachId })
}

// 根据城市查询教练列表
export const getCoachByCity = (params: CoachQueryParams): Promise<ApiResponse<PaginationResponse<CoachListItem>>> => {
  return request.post('/coach/queryByCity', params)
}

// 根据运动类型查询教练列表
export const getCoachByType = (params: CoachQueryParams): Promise<ApiResponse<PaginationResponse<CoachListItem>>> => {
  return request.post('/coach/queryByType', params)
}

// 根据区域查询教练列表
export const getCoachByArea = (params: CoachQueryParams): Promise<ApiResponse<PaginationResponse<CoachListItem>>> => {
  return request.post('/coach/queryByArea', params)
}

// 设置预约时间
export const setSchedule = (data: SetScheduleRequest): Promise<ApiResponse<CoachSchedule[]>> => {
  return request.post('/coach/setSchedule', data)
}

// 更新预约时间状态
export const updateScheduleStatus = (data: { scheduleId: number; status: number }[]): Promise<ApiResponse<CoachSchedule[]>> => {
  return request.post('/coach/updateStatus', data)
}

// 查看教练已预约的时间段
export const getCoachSchedules = (coachId: string, startDate: string, endDate: string): Promise<ApiResponse<any>> => {
  return request.post('/coach/initCoachSchedule', { coachId, startDate, endDate })
}

// 删除预约时间
export const deleteSchedule = (scheduleId: number, coachId: string): Promise<ApiResponse<any>> => {
  return request.post('/coach/delete', { scheduleId, coachId })
}
