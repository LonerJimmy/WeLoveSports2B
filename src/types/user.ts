// 用户相关类型
export interface UserInfo {
  userId: string
  username: string
  avatar?: string
  phone?: string
  email?: string
  gender: number // 0: 男, 1: 女
  cityId?: number
  cityName?: string
  coachId?: string | null
}

// 登录请求
export interface LoginRequest {
  head?: {
    userLongitude?: number
    userLatitude?: number
  }
  loginType: 'phone' | 'email' | 'username'
  phone?: string
  email?: string
  username?: string
  code?: string
  password?: string
}

// 完整用户信息（包含教练信息）
export interface CompleteUserInfo {
  userInfo: UserInfo
  coachInfo?: CoachInfo
  isCoach: boolean
  orderCount: number
}
