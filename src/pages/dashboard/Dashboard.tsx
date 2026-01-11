import { Card, Row, Col, Statistic } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
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
  LineChart,
  Line,
} from 'recharts'
import { useUserStore } from '@/stores'
import styles from './Dashboard.module.scss'

// 模拟数据
const weeklyData = [
  { day: '周一', orders: 12, revenue: 3600 },
  { day: '周二', orders: 19, revenue: 5200 },
  { day: '周三', orders: 15, revenue: 4800 },
  { day: '周四', orders: 22, revenue: 6400 },
  { day: '周五', orders: 28, revenue: 8200 },
  { day: '周六', orders: 35, revenue: 10500 },
  { day: '周日', orders: 32, revenue: 9600 },
]

const sportTypeData = [
  { name: '篮球', value: 35, color: '#1890ff' },
  { name: '瑜伽', value: 28, color: '#52c41a' },
  { name: '游泳', value: 18, color: '#faad14' },
  { name: '健身', value: 12, color: '#f5222d' },
  { name: '其他', value: 7, color: '#722ed1' },
]

const monthlyData = [
  { month: '1月', orders: 120, revenue: 36000 },
  { month: '2月', orders: 145, revenue: 43500 },
  { month: '3月', orders: 168, revenue: 50400 },
  { month: '4月', orders: 192, revenue: 57600 },
  { month: '5月', orders: 215, revenue: 64500 },
  { month: '6月', orders: 238, revenue: 71400 },
]

const Dashboard = () => {
  const { userInfo } = useUserStore()

  const stats = [
    {
      title: '总用户数',
      value: 1234,
      prefix: <UserOutlined />,
      suffix: '人',
    },
    {
      title: '教练总数',
      value: 86,
      prefix: <TeamOutlined />,
      suffix: '人',
    },
    {
      title: '总订单数',
      value: 5678,
      prefix: <ShoppingCartOutlined />,
      suffix: '单',
    },
    {
      title: '总营收',
      value: 128900,
      prefix: <DollarOutlined />,
      suffix: '元',
      precision: 2,
    },
  ]

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>数据看板</h2>

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
          <Card title="近7天订单趋势" className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
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
                <XAxis dataKey="day" />
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
                  data={sportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sportTypeData.map((entry, index) => (
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
              <BarChart data={monthlyData}>
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
