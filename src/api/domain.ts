import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'
import type { GetAllFilterTypesResponse } from '@/types'

/**
 * 获取所有筛选维度（教练类型/运动类型、城市、地区）
 * POST /domain/getAllFilterTypes
 */
export const getAllFilterTypes = (): Promise<AxiosResponse<ApiResponse<GetAllFilterTypesResponse>>> => {
  return request.post('/domain/getAllFilterTypes', {})
}
