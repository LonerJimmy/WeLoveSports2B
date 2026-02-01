import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Avatar,
  Rate,
  Tabs,
  Row,
  Col,
  Descriptions,
  Form,
  InputNumber,
  DatePicker,
  Modal,
  message,
} from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { getCoachByAll, getCoachDetail, getCoachSchedules, setSchedule, updateScheduleStatus, deleteSchedule, getAllFilterTypes } from '@/api'
import type { CoachListItem, CoachDetailInfo, CoachSchedule, CoachQueryParams, FilterTypeCity, FilterTypeArea } from '@/types'
import { useUserStore } from '@/stores'
import styles from './CoachList.module.scss'

// API 返回的教练详情数据结构（嵌套格式）
interface CoachDetailApiResponse {
  username: string
  avatar: string
  baseInfo: Omit<CoachDetailInfo, 'username' | 'certifications' | 'awards' | 'educations' | 'experiences'>
  professional?: {
    certifications?: any[]
    awards?: any[]
    educations?: any[]
    experiences?: any[]
  }
}


const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

const statusMap = {
  0: { text: '不可预约', color: 'default' },
  1: { text: '可预约', color: 'success' },
  2: { text: '已满员', color: 'warning' },
  3: { text: '已取消', color: 'error' },
  4: { text: '已过期', color: 'default' },
}

const CoachList = () => {
  const { userInfo } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()

  // 从 URL 参数获取状态，如果没有则使用默认值
  const activeTab = searchParams.get('tab') || 'list'
  const selectedCoachId = searchParams.get('coachId') || null

  // 设置状态到 URL
  const setActiveTab = (tab: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('tab', tab)
      // 只有切换到列表 tab 时才清除 coachId，其他情况保留
      if (tab === 'list') {
        newParams.delete('coachId')
      }
      return newParams
    })
  }

  const setSelectedCoachId = (coachId: string | null) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (coachId) {
        newParams.set('coachId', coachId)
        newParams.set('tab', 'detail')
      } else {
        newParams.delete('coachId')
        newParams.set('tab', 'list')
      }
      return newParams
    })
  }

  // 列表数据
  const [listLoading, setListLoading] = useState(false)
  const [coaches, setCoaches] = useState<CoachListItem[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 搜索条件：仅手机号（queryByAll 传 phone 模糊匹配）
  const [searchPhone, setSearchPhone] = useState('')

  // 筛选条件：教练类型、城市、区域（数据来自 getAllFilterTypes，请求走 queryByAll）
  const [selectedSportTypeId, setSelectedSportTypeId] = useState<number | null>(null)
  const [filterCityId, setFilterCityId] = useState<number | null>(null)
  const [filterAreaId, setFilterAreaId] = useState<number | null>(null)
  const [sportTypeOptions, setSportTypeOptions] = useState<{ id: number; name: string }[]>([])
  const [cityOptions, setCityOptions] = useState<FilterTypeCity[]>([])
  const [areaOptions, setAreaOptions] = useState<FilterTypeArea[]>([])

  // 详情数据
  const [detailLoading, setDetailLoading] = useState(false)
  const [coachDetail, setCoachDetail] = useState<CoachDetailInfo | null>(null)

  // 预约管理数据
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [schedules, setSchedules] = useState<CoachSchedule[]>([])
  const [hourlyRate, setHourlyRate] = useState<number>(200)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CoachSchedule | null>(null)
  const [form] = Form.useForm()

  // 获取所有筛选维度（教练类型、城市、区域）- 调用 getAllFilterTypes
  const fetchFilterTypes = async () => {
    try {
      const res = await getAllFilterTypes()
      if (res.data.success && res.data.data) {
        const { domains, cities, areas } = res.data.data
        setCityOptions(cities ?? [])
        setAreaOptions(areas ?? [])
        const types = (domains ?? []).flatMap(d => d.sportTypes ?? []).map(t => ({ id: t.id, name: t.name }))
        setSportTypeOptions(types)
      }
    } catch (error) {
      console.error('Failed to fetch filter types:', error)
    }
  }

  // 获取教练列表：统一走 queryByAll，支持城市、运动类型、区域组合筛选（AND）
  const fetchCoaches = async () => {
    try {
      setListLoading(true)
      const params: CoachQueryParams = {
        pageNum,
        pageSize,
        head: {
          userLongitude: 121.473701,
          userLatitude: 31.230416,
        },
      }
      if (searchPhone.trim()) {
        params.phone = searchPhone.trim()
      }
      if (selectedSportTypeId != null) {
        params.sportTypeId = selectedSportTypeId
      }
      if (filterCityId != null) {
        params.cityId = filterCityId
      }
      if (filterAreaId != null) {
        params.areaId = filterAreaId
      }

      const res = await getCoachByAll(params)
      if (res.data.success && res.data.data) {
        const data = res.data.data as { coachList?: CoachListItem[]; records?: CoachListItem[]; total?: number }
        setCoaches(data.records ?? data.coachList ?? [])
        setTotal(data.total ?? 0)
      }
    } catch (error) {
      console.error('Failed to fetch coaches:', error)
    } finally {
      setListLoading(false)
    }
  }

  // 获取教练详情
  const fetchCoachDetail = async (id: string) => {
    try {
      setDetailLoading(true)
      setCoachDetail(null)  // 先清空旧数据
      const res = await getCoachDetail(id)
      if (res.data.success && res.data.data) {
        const apiData = res.data.data as unknown as CoachDetailApiResponse
        const transformedData: CoachDetailInfo = {
          ...apiData.baseInfo,
          username: apiData.username,
          avatar: apiData.avatar,
          certifications: apiData.professional?.certifications,
          awards: apiData.professional?.awards,
          educations: apiData.professional?.educations,
          experiences: apiData.professional?.experiences,
        }
        setCoachDetail(transformedData)
      }
    } catch (error) {
      console.error('Failed to fetch coach detail:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  // 获取预约时间
  const fetchSchedules = async () => {
    if (!selectedCoachId) return

    try {
      setScheduleLoading(true)
      const startDate = dayjs().format('YYYY-MM-DD')
      const endDate = dayjs().add(3, 'month').format('YYYY-MM-DD')

      const res = await getCoachSchedules(selectedCoachId, startDate, endDate)
      if (res.data.success && res.data.data) {
        setSchedules(res.data.data.list || [])
        if (res.data.data.hourlyRate) {
          setHourlyRate(res.data.data.hourlyRate)
        }
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    } finally {
      setScheduleLoading(false)
    }
  }

  useEffect(() => {
    fetchCoaches()
  }, [pageNum, pageSize, selectedSportTypeId])

  useEffect(() => {
    fetchFilterTypes()
  }, [])

  useEffect(() => {
    if (activeTab === 'detail' && selectedCoachId) {
      fetchCoachDetail(selectedCoachId)
    }
  }, [activeTab, selectedCoachId])

  useEffect(() => {
    if (activeTab === 'schedule' && selectedCoachId) {
      fetchSchedules()
    }
  }, [activeTab, selectedCoachId])

  const handleSearch = () => {
    setPageNum(1)
    fetchCoaches()
  }

  const handleResetFilters = () => {
    setSearchPhone('')
    setSelectedSportTypeId(null)
    setFilterCityId(null)
    setFilterAreaId(null)
    setPageNum(1)
  }

  // 区域选项：选中城市时只展示该城市下的区域
  const filteredAreaOptions = filterCityId != null
    ? areaOptions.filter(a => a.cityId === filterCityId)
    : areaOptions

  const handleViewDetail = (coach: CoachListItem) => {
    setSelectedCoachId(coach.coachId)
    // setSelectedCoachId 已经会自动设置 tab 为 'detail'，不需要再调用 setActiveTab
  }

  const handleAddSchedule = () => {
    setEditingSchedule(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEditSchedule = (schedule: CoachSchedule) => {
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

  const handleDeleteSchedule = async (schedule: CoachSchedule) => {
    if (schedule.currentStudents > 0) {
      message.warning('该时间段已有预约，无法删除')
      return
    }

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个预约时间段吗？',
      onOk: async () => {
        try {
          await deleteSchedule(schedule.id, selectedCoachId!)
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
        await updateScheduleStatus([
          { scheduleId: editingSchedule.id, status: values.status },
        ])
        message.success('更新成功')
      } else {
        await setSchedule({
          coachId: selectedCoachId!,
          head: {
            userLongitude: 121.473701,
            userLatitude: 31.230416,
          },
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

  const listColumns: ColumnsType<CoachListItem> = [
    {
      title: '教练信息',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <Space>
          <Avatar src={record.avatar} size={40} icon={<SearchOutlined />} />
          <div>
            <div>{username}</div>
            <div className={styles.coachType}>{record.coachTypeName}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 0 ? '男' : '女'),
      width: 80,
    },
    {
      title: '教学经验',
      dataIndex: 'experienceYears',
      key: 'experienceYears',
      render: (years) => `${years} 年`,
      width: 100,
    },
    {
      title: '时薪',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (rate) => `¥${rate}/小时`,
      width: 120,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating, record) => (
        <Space>
          <Rate disabled defaultValue={rating} />
          <span>({record.totalReviews})</span>
        </Space>
      ),
      width: 180,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => (
        <Space>
          {record.isVerified === 1 && <Tag color="blue">已认证</Tag>}
          {record.isOnline === 1 && <Tag color="green">在线</Tag>}
          {record.status === 1 ? <Tag color="success">启用</Tag> : <Tag>禁用</Tag>}
        </Space>
      ),
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
      width: 100,
    },
  ]

  const scheduleColumns: ColumnsType<CoachSchedule> = [
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditSchedule(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSchedule(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.coachList}>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="教练列表" key="list">
            <div className={styles.header}>
              <h2>教练列表</h2>
              <Button type="primary" icon={<PlusOutlined />}>
                新增教练
              </Button>
            </div>

            {/* 搜索模块：仅手机号（queryByAll 传 phone 模糊匹配） */}
            <div className={styles.searchSection}>
              <span className={styles.label}>搜索：</span>
              <Input
                placeholder="请输入手机号"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onPressEnter={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
            </div>

            {/* 筛选模块：教练类型、城市、区域（选项来自 getAllFilterTypes） */}
            <div className={styles.filters}>
              <span className={styles.label}>筛选：</span>
              <Select
                placeholder="教练类型"
                allowClear
                value={selectedSportTypeId}
                onChange={(value: number | null) => {
                  setSelectedSportTypeId(value)
                  setPageNum(1)
                }}
                style={{ width: 160 }}
              >
                {sportTypeOptions.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="城市"
                allowClear
                value={filterCityId}
                onChange={(value: number | null) => {
                  setFilterCityId(value)
                  setFilterAreaId(null)
                  setPageNum(1)
                }}
                style={{ width: 140 }}
              >
                {cityOptions.map((c) => (
                  <Option key={c.cityId} value={c.cityId}>
                    {c.cityName}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="区域/商圈"
                allowClear
                value={filterAreaId ?? undefined}
                onChange={(value: number | undefined) => {
                  setFilterAreaId(value ?? null)
                  setPageNum(1)
                }}
                style={{ width: 140 }}
              >
                {filteredAreaOptions.map((a) => (
                  <Option key={a.areaId} value={a.areaId}>
                    {a.areaName}
                  </Option>
                ))}
              </Select>
              <Button onClick={handleSearch}>应用筛选</Button>
              <Button onClick={handleResetFilters}>重置</Button>
            </div>

            <Table
              columns={listColumns}
              dataSource={coaches}
              rowKey="coachId"
              loading={listLoading}
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
            />
          </TabPane>

          <TabPane tab="教练详情" key="detail" disabled={!selectedCoachId}>
            {detailLoading ? (
              <div>加载中...</div>
            ) : coachDetail ? (
              <>
                <Card className={styles.basicInfo}>
                  <Row gutter={24}>
                    <Col span={6}>
                      <Avatar src={coachDetail.avatar} size={120} icon={<EditOutlined />} />
                    </Col>
                    <Col span={18}>
                      <div className={styles.nameSection}>
                        <h2>{coachDetail.username}</h2>
                        <div className={styles.tags}>
                          <Tag color="blue">{coachDetail.gender === 0 ? '男' : '女'}</Tag>
                          <Tag color="green">{coachDetail.cityName}</Tag>
                        </div>
                        <div className={styles.rating}>
                          <Rate disabled defaultValue={coachDetail.rating} />
                          <span className={styles.reviewCount}>({coachDetail.totalReviews} 条评价)</span>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Descriptions column={2} bordered className={styles.descriptions}>
                    <Descriptions.Item label="教练ID">{coachDetail.coachId}</Descriptions.Item>
                    <Descriptions.Item label="性别">{coachDetail.gender === 0 ? '男' : '女'}</Descriptions.Item>
                    <Descriptions.Item label="教学经验">{coachDetail.experienceYears} 年</Descriptions.Item>
                    <Descriptions.Item label="时薪">¥{coachDetail.hourlyRate}/小时</Descriptions.Item>
                    <Descriptions.Item label="身高">{coachDetail.height} cm</Descriptions.Item>
                    <Descriptions.Item label="体重">{coachDetail.weight} kg</Descriptions.Item>
                    <Descriptions.Item label="城市">{coachDetail.cityName}</Descriptions.Item>
                    <Descriptions.Item label="区域">{coachDetail.coachArea || '暂无'}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={2}>
                      {coachDetail.coachAddress || '暂无'}
                    </Descriptions.Item>
                    <Descriptions.Item label="教学区域" span={2}>
                      {coachDetail.teachingAreas?.join('、') || '暂无'}
                    </Descriptions.Item>
                    <Descriptions.Item label="个人介绍" span={2}>
                      {coachDetail.introduction || '暂无介绍'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card>
                  <Tabs defaultActiveKey="certifications">
                    <TabPane tab="资格证书" key="certifications">
                      {coachDetail.certifications && coachDetail.certifications.length > 0 ? (
                        <Descriptions column={1} bordered>
                          {coachDetail.certifications.map((cert, index) => (
                            <Descriptions.Item key={index} label={cert.certificationName}>
                              <div>
                                <p>发证机构：{cert.issuingOrganization}</p>
                                <p>证书编号：{cert.certificationNumber || '暂无'}</p>
                                <p>发证日期：{cert.issueDate || '暂无'}</p>
                                <p>过期日期：{cert.expirationDate || '暂无'}</p>
                              </div>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      ) : (
                        <div>暂无资格证书</div>
                      )}
                    </TabPane>

                    <TabPane tab="荣誉奖项" key="awards">
                      {coachDetail.awards && coachDetail.awards.length > 0 ? (
                        <Descriptions column={1} bordered>
                          {coachDetail.awards.map((award, index) => (
                            <Descriptions.Item key={index} label={award.awardName}>
                              <div>
                                <p>颁奖机构：{award.awardingOrganization}</p>
                                <p>获奖日期：{award.awardDate}</p>
                                <p>奖项描述：{award.description || '暂无'}</p>
                              </div>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      ) : (
                        <div>暂无荣誉奖项</div>
                      )}
                    </TabPane>

                    <TabPane tab="教育背景" key="educations">
                      {coachDetail.educations && coachDetail.educations.length > 0 ? (
                        <Descriptions column={1} bordered>
                          {coachDetail.educations.map((edu, index) => (
                            <Descriptions.Item key={index} label={edu.schoolName}>
                              <div>
                                <p>专业：{edu.fieldOfStudy || '暂无'}</p>
                                <p>学历：{edu.degreeType || '暂无'}</p>
                                <p>
                                  时间：{edu.startDate} ~ {edu.endDate || '至今'}
                                </p>
                                <p>是否毕业：{edu.isGraduated ? '是' : '否'}</p>
                              </div>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      ) : (
                        <div>暂无教育背景</div>
                      )}
                    </TabPane>

                    <TabPane tab="工作经历" key="experiences">
                      {coachDetail.experiences && coachDetail.experiences.length > 0 ? (
                        <Descriptions column={1} bordered>
                          {coachDetail.experiences.map((exp, index) => (
                            <Descriptions.Item key={index} label={exp.organizationName}>
                              <div>
                                <p>职位：{exp.position}</p>
                                <p>
                                  时间：{exp.startDate} ~ {exp.endDate || '至今'}
                                </p>
                                <p>工作描述：{exp.description || '暂无'}</p>
                              </div>
                            </Descriptions.Item>
                          ))}
                        </Descriptions>
                      ) : (
                        <div>暂无工作经历</div>
                      )}
                    </TabPane>

                    <TabPane tab="预约管理" key="schedules">
                      <div className={styles.header}>
                        <div>
                          <h3>预约时间管理</h3>
                          <p>当前时薪：¥{hourlyRate}/小时</p>
                        </div>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSchedule}>
                          添加时间段
                        </Button>
                      </div>
                      <Table
                        columns={scheduleColumns}
                        dataSource={schedules}
                        rowKey="id"
                        loading={scheduleLoading}
                        pagination={{
                          pageSize: 20,
                          showSizeChanger: true,
                          showTotal: (t) => `共 ${t} 条`,
                        }}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </>
            ) : (
              <div>请先选择一个教练查看详情</div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingSchedule ? '编辑时间段' : '添加时间段'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="scheduleDate" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
            <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
            <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
          </Form.Item>

          <Form.Item name="maxStudents" label="最大学员数" initialValue={1}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]} initialValue={hourlyRate}>
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

          <Form.Item name="status" label="状态" initialValue={1}>
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

export default CoachList
