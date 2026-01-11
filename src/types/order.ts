import { Head } from './common'

// 订单状态
export enum OrderStatus {
  PENDING_PAYMENT = 0, // 待支付
  PAID = 1, // 已支付
  IN_PROGRESS = 2, // 进行中
  COMPLETED = 3, // 已完成
  CANCELLED = 4, // 已取消
}

// 支付状态
export enum PaymentStatus {
  UNPAID = 0, // 未支付
  PAID = 1, // 已支付
  REFUNDED = 2, // 已退款
}

// 预约时间段信息
export interface OrderSchedule {
  scheduleId: number
  scheduleDate: string
  startTime: string
  endTime: string
  price: number
  address: string
  area?: string
  longitude?: number
  latitude?: number
}

// 订单信息
export interface Order {
  id: number
  orderNo: string
  userId: string
  userName: string
  coachId: string
  coachName: string
  coachPhone?: string
  courseName: string
  courseType: number
  originalPrice: number
  actualPrice: number
  discountAmount: number
  paymentMethod: number
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  orderAddress: string
  orderArea?: string
  orderLongitude?: number
  orderLatitude?: number
  contactPhone?: string
  remark?: string
  schedules: OrderSchedule[]
}

// 创建订单请求
export interface CreateOrderRequest extends Head {
  userId: string
  coachId: string
  scheduleIds: number[]
  address?: string
  area?: string
  longitude?: number
  latitude?: number
  paymentAmount: number
  paymentMethod?: number
  contactPhone?: string
  remark?: string
}

// 订单查询参数
export interface OrderQueryParams extends Head {
  userId: string
  orderStatus?: OrderStatus
  pageNum?: number
  pageSize?: number
}
