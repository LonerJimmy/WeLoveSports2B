import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import {
  ApiResponse,
  CoachListPaginationResponse,
  CoachDetailInfo,
  CoachListItem,
  CoachQueryParams,
  SetScheduleRequest,
  CoachSchedule,
  SportTypesResponse,
} from '@/types'

// 获取运动类型（用于下拉筛选）
export const getSportTypesForFilter = (): Promise<AxiosResponse<ApiResponse<{ sportTypes: string[] | { id: number; name: string }[] }>>> => {
  return request.post('/coach/registration/init')
}

// 教练注册初始化
export const coachInit = (): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.post('/coach/registration/init')
}

// 教练注册
export const coachRegister = (data: any): Promise<AxiosResponse<ApiResponse<string>>> => {
  return request.post('/coach/registration/register', data)
}

// 查询教练详情
export const getCoachDetail = (coachId: string): Promise<AxiosResponse<ApiResponse<CoachDetailInfo>>> => {
  return request.post('/coach/queryDetail', { coachId })
}

// 根据城市查询教练列表
export const getCoachByCity = (params: CoachQueryParams): Promise<AxiosResponse<ApiResponse<CoachListPaginationResponse<CoachListItem>>>> => {
  return request.post('/coach/queryByCity', params)
}

// 根据运动类型查询教练列表
export const getCoachByType = (params: CoachQueryParams): Promise<AxiosResponse<ApiResponse<CoachListPaginationResponse<CoachListItem>>>> => {
  return request.post('/coach/queryByType', params)
}

// 根据区域查询教练列表
export const getCoachByArea = (params: CoachQueryParams): Promise<AxiosResponse<ApiResponse<CoachListPaginationResponse<CoachListItem>>>> => {
  return request.post('/coach/queryByArea', params)
}

/** 教练列表统一查询（queryByAll）：支持城市、运动类型、区域组合筛选，多条件 AND */
export const getCoachByAll = (params: CoachQueryParams): Promise<AxiosResponse<ApiResponse<CoachListPaginationResponse<CoachListItem>>>> => {
  return request.post('/coach/queryByAll', params)
}

// 设置预约时间
export const setSchedule = (data: SetScheduleRequest): Promise<AxiosResponse<ApiResponse<CoachSchedule[]>>> => {
  return request.post('/coach/setSchedule', data)
}

// 更新预约时间状态
export const updateScheduleStatus = (data: { scheduleId: number; status: number }[]): Promise<AxiosResponse<ApiResponse<CoachSchedule[]>>> => {
  return request.post('/coach/updateStatus', data)
}

// 查看教练已预约的时间段
export const getCoachSchedules = (coachId: string, startDate: string, endDate: string): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.post('/coach/initCoachSchedule', { coachId, startDate, endDate })
}

// 删除预约时间
export const deleteSchedule = (scheduleId: number, coachId: string): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.post('/coach/delete', { scheduleId, coachId })
}
