import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import { ApiResponse, UserInfo, CompleteUserInfo, LoginRequest } from '@/types'

// 发送验证码
export const sendCode = (phone: string): Promise<AxiosResponse<ApiResponse<string>>> => {
  return request.post('/user/sendCode', null, {
    params: { phone },
  })
}

// 用户登录
export const login = (data: LoginRequest): Promise<AxiosResponse<ApiResponse<{ token: string }>>> => {
  return request.post('/user/login', data)
}

// 微信登录
export const wechatLogin = (data: any): Promise<AxiosResponse<ApiResponse<string>>> => {
  return request.post('/user/wechatLogin', data)
}

// 用户注册
export const register = (data: any): Promise<AxiosResponse<ApiResponse<string>>> => {
  return request.post('/user/register', data)
}

// 用户登出
export const logout = (): Promise<AxiosResponse<ApiResponse<string>>> => {
  return request.post('/user/logout')
}

// 获取当前用户信息
export const getCurrentUser = (): Promise<AxiosResponse<ApiResponse<UserInfo>>> => {
  return request.get('/user/me')
}

// 获取用户完整信息
export const getUserInfo = (): Promise<AxiosResponse<ApiResponse<CompleteUserInfo>>> => {
  return request.get('/user/info')
}
