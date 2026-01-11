import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, AuthLayout } from '@/layouts'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/dashboard/Dashboard'
import CoachList from '@/pages/coach/CoachList'
import OrderManage from '@/pages/order/OrderManage'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'coach',
        element: <CoachList />,
      },
      {
        path: 'order',
        element: <OrderManage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
