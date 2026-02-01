import { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col, Statistic, Button, Spin } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getStatisticsOverview } from '@/api'
import type { StatisticsOverviewData, OrderStatBySportType } from '@/api'
import styles from './Dashboard.module.scss'

const PIE_COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96']

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<StatisticsOverviewData | null>(null)

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getStatisticsOverview()
      if (res.data.success && res.data.data) {
        setOverview(res.data.data)
      }
    } catch (error) {
      console.error('[Dashboard] getStatisticsOverview 请求失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  const stats = overview
    ? [
        {
          title: '总用户数',
          value: overview.totalUserCount,
          prefix: <UserOutlined />,
          suffix: '人',
        },
        {
          title: '教练总数',
          value: overview.totalCoachCount,
          prefix: <TeamOutlined />,
          suffix: '人',
        },
        {
          title: '总订单数',
          value: overview.totalOrderCount,
          prefix: <ShoppingCartOutlined />,
          suffix: '单',
        },
        {
          title: '总营收',
          value: overview.totalRevenue,
          prefix: <DollarOutlined />,
          suffix: '元',
          precision: 2,
        },
      ]
    : []

  const monthlyChartData =
    overview?.monthlyStats?.map((m) => ({
      month: m.month,
      orders: m.orderCount,
      revenue: Number(Number(m.revenue).toFixed(2)),
    })) ?? []

  const sportTypeChartData: { name: string; value: number; color: string }[] =
    overview?.orderStatsBySportType?.map((s: OrderStatBySportType, i: number) => ({
      name: s.sportTypeName,
      value: s.orderCount,
      color: PIE_COLORS[i % PIE_COLORS.length],
    })) ?? []

  if (loading && !overview) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.spinWrap}>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>数据看板</h2>
        <Button type="primary" icon={<ReloadOutlined />} onClick={fetchOverview} loading={loading}>
          刷新数据
        </Button>
      </div>

      <Row gutter={16} className={styles.stats}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                precision={stat.precision}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} className={styles.charts}>
        <Col xs={24} lg={16}>
          <Card title="月度订单与营收趋势" className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyChartData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  name="订单数"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="营收(元)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="运动类型分布" className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sportTypeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sportTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className={styles.charts}>
        <Col xs={24}>
          <Card title="月度营收统计" className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1890ff" name="订单数" />
                <Bar dataKey="revenue" fill="#52c41a" name="营收(元)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
