import { useState, useEffect } from 'react'
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
  Modal,
} from 'antd'
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { getCoachByCity, getCoachByType, getCoachByArea } from '@/api'
import type { CoachListItem } from '@/types'
import styles from './CoachList.module.scss'

const { Search } = Input
const { Option } = Select

const CoachList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [coaches, setCoaches] = useState<CoachListItem[]>([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<'city' | 'type' | 'area'>('city')
  const [selectedCoach, setSelectedCoach] = useState<CoachListItem | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)

  const fetchCoaches = async () => {
    try {
      setLoading(true)
      const params: any = {
        pageNum,
        pageSize,
        head: {
          userLongitude: 121.473701,
          userLatitude: 31.230416,
        },
      }

      let res
      if (filterType === 'city') {
        res = await getCoachByCity({ ...params, cityId: 1, cityName: '上海' })
      } else if (filterType === 'type') {
        res = await getCoachByType({ ...params, sportTypeId: 1 })
      } else {
        res = await getCoachByArea({ ...params, area: searchText || '浦东新区' })
      }

      if (res.success && res.data) {
        setCoaches(res.data.records || [])
        setTotal(res.data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch coaches:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoaches()
  }, [pageNum, pageSize, filterType])

  const handleSearch = () => {
    setPageNum(1)
    fetchCoaches()
  }

  const handleViewDetail = (coach: CoachListItem) => {
    setSelectedCoach(coach)
    setDetailVisible(true)
  }

  const columns: ColumnsType<CoachListItem> = [
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
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看详情
        </Button>
      ),
      width: 100,
    },
  ]

  return (
    <div className={styles.coachList}>
      <Card>
        <div className={styles.header}>
          <h2>教练列表</h2>
          <Button type="primary" icon={<PlusOutlined />}>
            新增教练
          </Button>
        </div>

        <div className={styles.filters}>
          <Space size="middle">
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 120 }}
            >
              <Option value="city">按城市</Option>
              <Option value="type">按类型</Option>
              <Option value="area">按区域</Option>
            </Select>

            {filterType !== 'area' && (
              <Search
                placeholder="请输入搜索关键词"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 200 }}
              />
            )}

            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={coaches}
          rowKey="coachId"
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
        />
      </Card>

      <Modal
        title="教练详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCoach && (
          <div className={styles.detail}>
            <div className={styles.detailHeader}>
              <Avatar src={selectedCoach.avatar} size={80} />
              <div className={styles.detailInfo}>
                <h3>{selectedCoach.username}</h3>
                <p>{selectedCoach.coachTypeName}</p>
                <Space>
                  <Rate disabled defaultValue={selectedCoach.rating} />
                  <span>({selectedCoach.totalReviews} 条评价)</span>
                </Space>
              </div>
            </div>

            <div className={styles.detailContent}>
              <p>
                <strong>教学经验：</strong>
                {selectedCoach.experienceYears} 年
              </p>
              <p>
                <strong>时薪：</strong>
                ¥{selectedCoach.hourlyRate}/小时
              </p>
              <p>
                <strong>个人介绍：</strong>
                {selectedCoach.introduction || '暂无介绍'}
              </p>
            </div>

            <div className={styles.detailActions}>
              <Button type="primary" onClick={() => {
                setDetailVisible(false)
                navigate(`/coach/detail/${selectedCoach.coachId}`)
              }}>
                查看完整详情
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CoachList
