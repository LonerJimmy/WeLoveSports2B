import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, theme } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useUserStore, useAppStore } from '@/stores'
import styles from './MainLayout.module.scss'

const { Header, Sider, Content } = Layout

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '数据看板',
  },
  {
    key: '/coach',
    icon: <TeamOutlined />,
    label: '教练管理',
    children: [
      {
        key: '/coach/list',
        label: '教练列表',
      },
      {
        key: '/coach/detail',
        label: '教练详情',
      },
    ],
  },
  {
    key: '/schedule',
    icon: <CalendarOutlined />,
    label: '预约管理',
  },
  {
    key: '/order',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
  },
]

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const { userInfo, logout } = useUserStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const getSelectedKeys = () => {
    return [location.pathname]
  }

  const getOpenKeys = () => {
    const path = location.pathname
    if (path.startsWith('/coach')) {
      return ['/coach']
    }
    return []
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className={styles.sider}
        style={{ background: token.colorBgContainer }}
      >
        <div className={styles.logo} onClick={() => navigate('/dashboard')}>
          <span className={styles.logoText}>
            {sidebarCollapsed ? '教练' : '教练管理系统'}
          </span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header className={styles.header} style={{ background: token.colorBgContainer }}>
          <div className={styles.headerLeft}>
            {sidebarCollapsed ? (
              <MenuUnfoldOutlined onClick={toggleSidebar} className={styles.trigger} />
            ) : (
              <MenuFoldOutlined onClick={toggleSidebar} className={styles.trigger} />
            )}
          </div>
          <div className={styles.headerRight}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar
                  src={userInfo?.userInfo?.avatar}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span className={styles.username}>{userInfo?.userInfo?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
