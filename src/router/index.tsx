import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, AuthLayout } from '@/layouts'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Login from '@/pages/auth/Login'
import Dashboard from '@/pages/dashboard/Dashboard'
import CoachList from '@/pages/coach/CoachList'
import CoachDetail from '@/pages/coach/CoachDetail'
import ScheduleManage from '@/pages/schedule/ScheduleManage'
import OrderManage from '@/pages/order/OrderManage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
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
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'coach',
        children: [
          {
            index: true,
            element: <Navigate to="/coach/list" replace />,
          },
          {
            path: 'list',
            element: <CoachList />,
          },
          {
            path: 'detail/:coachId',
            element: <CoachDetail />,
          },
        ],
      },
      {
        path: 'schedule',
        element: <ScheduleManage />,
      },
      {
        path: 'order',
        element: <OrderManage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
], {
  future: {
    v7_startTransition: true,
  },
})

export default router
