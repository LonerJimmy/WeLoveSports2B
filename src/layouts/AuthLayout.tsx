import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.scss'

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>教练管理系统</h1>
          <p>Coach Management System</p>
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
