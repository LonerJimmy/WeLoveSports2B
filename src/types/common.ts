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

// 教练列表分页响应（使用 coachList 而不是 records）
export interface CoachListPaginationResponse<T> {
  coachList: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

export interface Head {
  authorization?: string
  clientId?: string
  userId?: string
  createTime?: number
  userLongitude?: number
  userLatitude?: number
}
