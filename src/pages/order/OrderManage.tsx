import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Select,
  Tag,
  Button,
  Space,
  Modal,
  Descriptions,
  List,
} from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getOrderList, cancelOrder } from '@/api'
import { useUserStore } from '@/stores'
import type { Order, OrderStatus, PaymentStatus } from '@/types'
import styles from './OrderManage.module.scss'

const { Option } = Select

const orderStatusMap = {
  0: { text: '待支付', color: 'default' },
  1: { text: '已支付', color: 'success' },
  2: { text: '进行中', color: 'processing' },
  3: { text: '已完成', color: 'success' },
  4: { text: '已取消', color: 'error' },
}

const paymentStatusMap = {
  0: { text: '未支付', color: 'default' },
  1: { text: '已支付', color: 'success' },
  2: { text: '已退款', color: 'warning' },
}

const OrderManage = () => {
  const { userInfo } = useUserStore()
  const userId = userInfo?.userInfo?.userId || ''

  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>(undefined)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)

  const fetchOrders = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const res = await getOrderList({
        userId,
        orderStatus: filterStatus,
        pageNum,
        pageSize,
        head: {
          userLongitude: 121.473701,
          userLatitude: 31.230416,
        },
      })

      if (res.success && res.data) {
        setOrders(res.data)
        setTotal(res.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [pageNum, pageSize, filterStatus, userId])

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order)
    setDetailVisible(true)
  }

  const handleCancelOrder = async (order: Order) => {
    Modal.confirm({
      title: '确认取消订单',
      content: '确定要取消这个订单吗？',
      onOk: async () => {
        try {
          await cancelOrder(order.id, userId)
          Modal.success({
            title: '取消成功',
            content: '订单已成功取消',
          })
          fetchOrders()
        } catch (error) {
          console.error('Failed to cancel order:', error)
        }
      },
    })
  }

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      ellipsis: true,
    },
    {
      title: '教练',
      dataIndex: 'coachName',
      key: 'coachName',
      width: 120,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 120,
    },
    {
      title: '订单金额',
      dataIndex: 'actualPrice',
      key: 'actualPrice',
      render: (price) => `¥${price}`,
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        const config = orderStatusMap[status as keyof typeof orderStatusMap]
        return <Tag color={config.color}>{config.text}</Tag>
      },
      width: 100,
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        const config = paymentStatusMap[status as keyof typeof paymentStatusMap]
        return <Tag color={config.color}>{config.text}</Tag>
      },
      width: 100,
    },
    {
      title: '预约时间',
      dataIndex: 'schedules',
      key: 'schedules',
      render: (schedules) => {
        if (!schedules || schedules.length === 0) return '-'
        const firstSchedule = schedules[0]
        return `${firstSchedule.scheduleDate} ${firstSchedule.startTime.slice(0, 5)}`
      },
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          {record.orderStatus === 0 && (
            <Button
              type="link"
              danger
              onClick={() => handleCancelOrder(record)}
            >
              取消订单
            </Button>
          )}
        </Space>
      ),
      width: 180,
    },
  ]

  return (
    <div className={styles.orderManage}>
      <Card>
        <div className={styles.header}>
          <h2>订单管理</h2>
          <Select
            placeholder="筛选订单状态"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => {
              setFilterStatus(value)
              setPageNum(1)
            }}
          >
            <Option value={0}>待支付</Option>
            <Option value={1}>已支付</Option>
            <Option value={2}>进行中</Option>
            <Option value={3}>已完成</Option>
            <Option value={4}>已取消</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, size) => {
              setPageNum(page)
              setPageSize(size)
            },
          }}
          expandable={{
            expandedRowRender: (record) => (
              <List
                dataSource={record.schedules}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.scheduleDate} ${item.startTime} - ${item.endTime}`}
                      description={
                        <Space>
                          <span>价格：¥{item.price}</span>
                          <span>地址：{item.address}</span>
                          {item.area && <span>商圈：{item.area}</span>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className={styles.detail}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="订单号" span={2}>
                {selectedOrder.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="教练姓名">
                {selectedOrder.coachName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {selectedOrder.coachPhone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="课程名称">
                {selectedOrder.courseName}
              </Descriptions.Item>
              <Descriptions.Item label="课程类型">
                {selectedOrder.courseType === 1
                  ? '一对一'
                  : selectedOrder.courseType === 2
                  ? '小班课'
                  : selectedOrder.courseType === 3
                  ? '大班课'
                  : '在线课程'}
              </Descriptions.Item>
              <Descriptions.Item label="原价">
                ¥{selectedOrder.originalPrice}
              </Descriptions.Item>
              <Descriptions.Item label="实付金额">
                ¥{selectedOrder.actualPrice}
              </Descriptions.Item>
              <Descriptions.Item label="优惠金额">
                ¥{selectedOrder.discountAmount}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={orderStatusMap[selectedOrder.orderStatus as keyof typeof orderStatusMap].color}>
                  {orderStatusMap[selectedOrder.orderStatus as keyof typeof orderStatusMap].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="支付状态">
                <Tag color={paymentStatusMap[selectedOrder.paymentStatus as keyof typeof paymentStatusMap].color}>
                  {paymentStatusMap[selectedOrder.paymentStatus as keyof typeof paymentStatusMap].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="订单地址" span={2}>
                {selectedOrder.orderAddress}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={2}>
                {selectedOrder.contactPhone || '-'}
              </Descriptions.Item>
              {selectedOrder.remark && (
                <Descriptions.Item label="备注" span={2}>
                  {selectedOrder.remark}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className={styles.schedules}>
              <h3>预约时间</h3>
              <List
                dataSource={selectedOrder.schedules}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.scheduleDate} ${item.startTime} - ${item.endTime}`}
                      description={
                        <Space direction="vertical" size="small">
                          <span>价格：¥{item.price}</span>
                          <span>地址：{item.address}</span>
                          {item.area && <span>商圈：{item.area}</span>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default OrderManage
