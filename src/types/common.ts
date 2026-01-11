// 通用类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  errorMsg?: string
}

export interface PaginationResponse<T> {
  records: T[]
  total: number
  pageNum: number
  pageSize: number
}

export interface Head {
  clientId?: string
  userId?: string
  userLongitude?: number
  userLatitude?: number
}
