import request from '@/utils/request'
import { ApiResponse, Order, CreateOrderRequest, OrderQueryParams } from '@/types'

// 创建订单
export const createOrder = (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
  return request.post('/order/create', data)
}

// 查询订单详情
export const getOrderDetail = (orderId: number, userId: string): Promise<ApiResponse<Order>> => {
  return request.post('/order/detail', { orderId, userId })
}

// 查询用户订单列表
export const getOrderList = (params: OrderQueryParams): Promise<ApiResponse<Order[]>> => {
  return request.post('/order/list', params)
}

// 更新订单支付状态
export const updatePaymentStatus = (orderNo: string, paymentStatus: number): Promise<ApiResponse<any>> => {
  return request.post('/order/updatePaymentStatus', { orderNo, paymentStatus })
}

// 取消订单
export const cancelOrder = (orderId: number, userId: string): Promise<ApiResponse<any>> => {
  return request.post('/order/cancel', { orderId, userId })
}
