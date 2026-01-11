import { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/stores'
import { login } from '@/api'
import type { LoginRequest } from '@/types'
import styles from './Login.module.scss'

const Login = () => {
  const navigate = useNavigate()
  const { login: setUserLogin, getUserInfo } = useUserStore()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: any) => {
    try {
      setLoading(true)
      const data: LoginRequest = {
        loginType: 'username',
        username: values.username,
        password: values.password,
        head: {
          userLongitude: 121.473701,
          userLatitude: 31.230416,
        },
      }

      const res = await login(data)
      if (res.success && res.data) {
        setUserLogin(res.data)
        await getUserInfo()
        message.success('登录成功')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.login}>
      <h2 className={styles.title}>教练登录</h2>
      <Form onFinish={handleLogin} autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
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
