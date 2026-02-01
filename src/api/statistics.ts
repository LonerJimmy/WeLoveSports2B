import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'

/** 概览接口返回：按月统计 */
export interface MonthlyStat {
  month: string
  orderCount: number
  revenue: number
}

/** 概览接口返回：按运动类型统计 */
export interface OrderStatBySportType {
  sportTypeId: number
  sportTypeName: string
  orderCount: number
  revenue: number
}

/** 概览接口返回数据结构 */
export interface StatisticsOverviewData {
  totalUserCount: number
  totalCoachCount: number
  monthlyStats: MonthlyStat[]
  totalOrderCount: number
  totalRevenue: number
  orderStatsBySportType: OrderStatBySportType[]
}

/**
 * 概览数据（数据看板）
 * POST /statistics/overview，无需请求体，无需登录
 */
export const getStatisticsOverview = (): Promise<
  AxiosResponse<ApiResponse<StatisticsOverviewData>>
> => {
  return request.post('/statistics/overview', {})
}
