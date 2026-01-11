import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import { ApiResponse, Head } from '@/types'

// 预约查询请求参数
export interface BookReservationParams extends Head {
  coachId: string
  startDate: string
  endDate: string
}

// 查询教练可预约时间
export const getAvailableSchedules = (params: BookReservationParams): Promise<AxiosResponse<ApiResponse<any>>> => {
  return request.post('/book/reservation', params)
}
