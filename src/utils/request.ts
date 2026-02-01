import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：token 作为登录标记，放入每个请求的 head.authorization
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.authorization = token
    }
    // 有 body 的请求统一在 body.head 中带上 authorization，供后端校验登录态
    if (token && config.data && typeof config.data === 'object') {
      config.data.head = {
        ...(config.data.head || {}),
        authorization: token,
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 检查业务状态码
    if (data.success === false) {
      message.error(data.errorMsg || '请求失败')
      return Promise.reject(new Error(data.errorMsg || '请求失败'))
    }

    return response
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(data?.errorMsg || '请求失败')
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request
