import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Rate,
  Avatar,
  Button,
  Tabs,
  Empty,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { getCoachDetail } from '@/api'
import type { CoachDetailInfo } from '@/types'
import styles from './CoachDetail.module.scss'

const { TabPane } = Tabs

const CoachDetail = () => {
  const { coachId } = useParams<{ coachId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [coach, setCoach] = useState<CoachDetailInfo | null>(null)

  const fetchCoachDetail = async () => {
    if (!coachId) return

    try {
      setLoading(true)
      const res = await getCoachDetail(coachId)
      if (res.success && res.data) {
        setCoach(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch coach detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoachDetail()
  }, [coachId])

  if (!coach) {
    return <div className={styles.loading}>加载中...</div>
  }

  const {
    username,
    avatar,
    gender,
    cityId,
    coachId: id,
    introduction,
    experienceYears,
    hourlyRate,
    rating,
    totalReviews,
    totalStudents,
    distance,
    cityName,
    coachArea,
    coachAddress,
    height,
    weight,
    certifications,
    awards,
    educations,
    experiences,
    sportTypeIds,
    teachingAreas,
  } = coach

  return (
    <div className={styles.coachDetail}>
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/coach/list')}
        >
          返回列表
        </Button>
        <Button type="primary" icon={<EditOutlined />}>
          编辑信息
        </Button>
      </div>

      <Card className={styles.basicInfo} loading={loading}>
        <Row gutter={24}>
          <Col span={6}>
            <Avatar src={avatar} size={120} icon={<EditOutlined />} />
          </Col>
          <Col span={18}>
            <div className={styles.nameSection}>
              <h2>{username}</h2>
              <div className={styles.tags}>
                <Tag color="blue">{gender === 0 ? '男' : '女'}</Tag>
                <Tag color="green">{cityName}</Tag>
                {distance && <Tag color="orange">距离 {distance}km</Tag>}
              </div>
              <div className={styles.rating}>
                <Rate disabled defaultValue={rating} />
                <span className={styles.reviewCount}>({totalReviews} 条评价)</span>
              </div>
            </div>
          </Col>
        </Row>

        <Descriptions column={2} bordered className={styles.descriptions}>
          <Descriptions.Item label="教练ID">{id}</Descriptions.Item>
          <Descriptions.Item label="性别">{gender === 0 ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="教学经验">{experienceYears} 年</Descriptions.Item>
          <Descriptions.Item label="时薪">¥{hourlyRate}/小时</Descriptions.Item>
          <Descriptions.Item label="身高">{height} cm</Descriptions.Item>
          <Descriptions.Item label="体重">{weight} kg</Descriptions.Item>
          <Descriptions.Item label="城市">{cityName}</Descriptions.Item>
          <Descriptions.Item label="区域">{coachArea || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>
            {coachAddress || '暂无'}
          </Descriptions.Item>
          <Descriptions.Item label="教学区域" span={2}>
            {teachingAreas?.join('、') || '暂无'}
          </Descriptions.Item>
          <Descriptions.Item label="个人介绍" span={2}>
            {introduction || '暂无介绍'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className={styles.stats}>
        <Row gutter={16}>
          <Col span={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalStudents}</div>
              <div className={styles.statLabel}>总学员数</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalReviews}</div>
              <div className={styles.statLabel}>总评价数</div>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{rating}</div>
              <div className={styles.statLabel}>综合评分</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs defaultActiveKey="certifications">
          <TabPane tab="资格证书" key="certifications">
            {certifications && certifications.length > 0 ? (
              <Descriptions column={1} bordered>
                {certifications.map((cert, index) => (
                  <Descriptions.Item
                    key={index}
                    label={cert.certificationName}
                  >
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
              <Empty description="暂无资格证书" />
            )}
          </TabPane>

          <TabPane tab="荣誉奖项" key="awards">
            {awards && awards.length > 0 ? (
              <Descriptions column={1} bordered>
                {awards.map((award, index) => (
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
              <Empty description="暂无荣誉奖项" />
            )}
          </TabPane>

          <TabPane tab="教育背景" key="educations">
            {educations && educations.length > 0 ? (
              <Descriptions column={1} bordered>
                {educations.map((edu, index) => (
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
              <Empty description="暂无教育背景" />
            )}
          </TabPane>

          <TabPane tab="工作经历" key="experiences">
            {experiences && experiences.length > 0 ? (
              <Descriptions column={1} bordered>
                {experiences.map((exp, index) => (
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
              <Empty description="暂无工作经历" />
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default CoachDetail
