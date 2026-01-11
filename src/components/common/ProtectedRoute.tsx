import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, token, hasHydrated } = useUserStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 等待 Zustand 持久化完成
    if (hasHydrated) {
      setIsChecking(false)
      if (!isAuthenticated || !token) {
        // 使用 search 参数传递来源信息，更可靠
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
          replace: true,
        })
      }
    }
  }, [isAuthenticated, token, navigate, location, hasHydrated])

  // 持久化未完成时，显示加载状态
  if (isChecking) {
    return <div>加载中...</div>
  }

  // 持久化完成后，检查是否已认证
  if (!isAuthenticated || !token) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
