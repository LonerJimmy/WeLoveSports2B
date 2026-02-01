import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Space,
  Tag,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getCoachSchedules, setSchedule, updateScheduleStatus, deleteSchedule } from '@/api'
import { useUserStore } from '@/stores'
import type { CoachSchedule } from '@/types'
import styles from './ScheduleManage.module.scss'

const { Option } = Select
const { TextArea } = Input

const statusMap = {
  0: { text: '不可预约', color: 'default' },
  1: { text: '可预约', color: 'success' },
  2: { text: '已满员', color: 'warning' },
  3: { text: '已取消', color: 'error' },
  4: { text: '已过期', color: 'default' },
}

const ScheduleManage = () => {
  const { userInfo } = useUserStore()
  const coachId = userInfo?.coachInfo?.coachId || ''

  const [loading, setLoading] = useState(false)
  const [schedules, setSchedules] = useState<CoachSchedule[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CoachSchedule | null>(null)
  const [hourlyRate, setHourlyRate] = useState<number>(200)
  const [form] = Form.useForm()

  const fetchSchedules = async () => {
    if (!coachId) return

    const token = localStorage.getItem('token')
    if (!token) {
      message.warning('请先登录后再查看预约时间')
      return
    }

    try {
      setLoading(true)
      const startDate = dayjs().format('YYYY-MM-DD')
      const endDate = dayjs().add(3, 'month').format('YYYY-MM-DD')

      const res = await getCoachSchedules(coachId, startDate, endDate)
      if (res.success && res.data) {
        setSchedules(res.data.list || [])
        if (res.data.hourlyRate) {
          setHourlyRate(res.data.hourlyRate)
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [coachId])

  const handleAdd = () => {
    setEditingSchedule(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (schedule: CoachSchedule) => {
    setEditingSchedule(schedule)
    form.setFieldsValue({
      scheduleDate: dayjs(schedule.scheduleDate),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      maxStudents: schedule.maxStudents,
      price: schedule.price,
      address: schedule.address,
      area: schedule.area,
      longitude: schedule.longitude,
      latitude: schedule.latitude,
      status: schedule.status,
      remark: schedule.remark,
    })
    setModalVisible(true)
  }

  const handleDelete = async (schedule: CoachSchedule) => {
    if (schedule.currentStudents > 0) {
      message.warning('该时间段已有预约，无法删除')
      return
    }

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个预约时间段吗？',
      onOk: async () => {
        try {
          await deleteSchedule(schedule.id, coachId)
          message.success('删除成功')
          fetchSchedules()
        } catch (error) {
          console.error('Failed to delete schedule:', error)
        }
      },
    })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (editingSchedule) {
        // 更新状态
        await updateScheduleStatus([
          { scheduleId: editingSchedule.id, status: values.status },
        ])
        message.success('更新成功')
      } else {
        // 新增
        await setSchedule({
          coachId,
          hourlyRate,
          schedules: [
            {
              scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
              startTime: values.startTime.format('HH:mm:ss'),
              endTime: values.endTime.format('HH:mm:ss'),
              maxStudents: values.maxStudents || 1,
              address: values.address,
              area: values.area,
              longitude: values.longitude,
              latitude: values.latitude,
              status: values.status || 1,
              remark: values.remark,
            },
          ],
        })
        message.success('添加成功')
      }

      setModalVisible(false)
      fetchSchedules()
    } catch (error) {
      console.error('Failed to save schedule:', error)
    }
  }

  const columns: ColumnsType<CoachSchedule> = [
    {
      title: '日期',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '最大学员数',
      dataIndex: 'maxStudents',
      key: 'maxStudents',
    },
    {
      title: '当前学员数',
      dataIndex: 'currentStudents',
      key: 'currentStudents',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusMap[status as keyof typeof statusMap]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.scheduleManage}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>预约时间管理</h2>
            <p>当前时薪：¥{hourlyRate}/小时</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加时间段
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={schedules}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingSchedule ? '编辑时间段' : '添加时间段'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="scheduleDate"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item name="maxStudents" label="最大学员数" initialValue={1}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
            initialValue={hourlyRate}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item name="area" label="商圈">
            <Input placeholder="请输入商圈" />
          </Form.Item>

          <Form.Item name="longitude" label="经度">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="latitude" label="纬度">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select>
              <Option value={0}>不可预约</Option>
              <Option value={1}>可预约</Option>
              <Option value={2}>已满员</Option>
              <Option value={3}>已取消</Option>
              <Option value={4}>已过期</Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ScheduleManage
