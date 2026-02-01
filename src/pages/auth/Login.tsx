import { useState, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores'
import { login } from '@/api'
import type { LoginRequest } from '@/types'
import styles from './Login.module.scss'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login: setUserLogin, isAuthenticated, hasHydrated } = useUserStore()
  const [loading, setLoading] = useState(false)

  // 从 URL search 参数或 state 中获取登录前的页面路径
  const searchParams = new URLSearchParams(location.search)
  const redirectParam = searchParams.get('redirect')
  const from = redirectParam ? decodeURIComponent(redirectParam) : ((location.state as any)?.from || '/')

  // 监听登录状态，登录成功后跳转
  useEffect(() => {
    // 只有当前在登录页面时才执行跳转逻辑
    if (location.pathname !== '/login') {
      return
    }
    if (isAuthenticated && hasHydrated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, hasHydrated, navigate, from, location.pathname])

  const handleLogin = async (values: { phone: string; code: string }) => {
    try {
      setLoading(true)
      const data: LoginRequest = {
        head: {
          clientId: '37002027491260519040',
          userLongitude: 121.473701,
          userLatitude: 31.230416,
        },
        loginType: 'phone',
        phone: values.phone,
        code: values.code,
      }

      const res = await login(data)
      if (res.data.success && res.data.data) {
        const token = typeof res.data.data === 'string' ? res.data.data : res.data.data.token
        setUserLogin(token)
        message.success('登录成功')
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // 如果不在登录页面，不渲染任何内容
  if (location.pathname !== '/login') {
    return null
  }

  return (
    <div className={styles.login}>
      <h2 className={styles.title}>教练登录</h2>
      <Form onFinish={handleLogin} autoComplete="off">
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="手机号"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入验证码' }, { len: 6, message: '验证码为6位' }]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="验证码（6位）"
            size="large"
            maxLength={6}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
