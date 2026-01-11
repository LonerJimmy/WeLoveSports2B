import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, token } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [isAuthenticated, token, navigate, location])

  if (!isAuthenticated || !token) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
