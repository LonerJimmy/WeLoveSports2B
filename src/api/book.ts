import request from '@/utils/request'
import { ApiResponse } from '@/types'

// 查询教练可预约时间
export const getAvailableSchedules = (
  coachId: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<any>> => {
  return request.post('/book/reservation', { coachId, startDate, endDate })
}
