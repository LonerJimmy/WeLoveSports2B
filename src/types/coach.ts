// 运动类型
export interface SportType {
  id: number
  name: string
  icon: string
  sort: number
}

// 运动领域
export interface SportDomain {
  domainId: string
  domainName: string
  sportTypes: SportType[]
}

// 运动类型响应
export interface SportTypesResponse {
  domains: SportDomain[]
}

// 获取所有筛选维度接口返回
export interface FilterTypeSportType {
  id: number
  name: string
  icon?: string
  sort?: number
}

export interface FilterTypeDomain {
  domainId: string
  domainName: string
  sportTypes: FilterTypeSportType[]
}

export interface FilterTypeCity {
  cityId: number
  cityName: string
}

export interface FilterTypeArea {
  areaId: number
  cityId: number
  areaName: string
}

export interface GetAllFilterTypesResponse {
  domains: FilterTypeDomain[]
  cities: FilterTypeCity[]
  areas: FilterTypeArea[]
}

// 教练基础信息
export interface CoachBasicInfo {
  coachId: string
  avatar?: string
  introduction?: string
  experienceYears?: number
  sportTypeIds: number[]
  teachingAreas?: string[]
  hourlyRate?: number
  height?: number
  weight?: number
  coachAddress?: string
  coachArea?: string
  coachLongitude?: number
  coachLatitude?: number
}

// 教练详细信息
export interface CoachDetailInfo extends CoachBasicInfo {
  username: string
  gender: number
  cityId: number
  rating?: number
  totalReviews?: number
  totalStudents?: number
  distance?: number
  cityName?: string
  certifications?: Certification[]
  awards?: Award[]
  educations?: Education[]
  experiences?: Experience[]
}

// 教练列表项
export interface CoachListItem {
  username: string
  gender: number
  cityId: number
  coachId: string
  avatar?: string
  introduction?: string
  experienceYears?: number
  hourlyRate?: number
  rating?: number
  totalReviews?: number
  coachTypeName?: string
  certifications?: Certification[]
  awards?: Award[]
  /** 是否认证（0：未认证，1：已认证） */
  isVerified: number
  isOnline: number
  status: number
  sportTypeIds: number[]
}

// 教育经历
export interface Education {
  schoolName: string
  schoolId: number
  degreeType?: string
  fieldOfStudy?: string
  startDate: string
  endDate?: string
  isGraduated?: boolean
  description?: string
  relevantCourses?: string
  isHighestDegree?: boolean
  priority?: number
  diplomaUrl?: string[]
  transcriptUrl?: string[]
}

// 工作经历
export interface Experience {
  organizationName: string
  position: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
  description?: string
  responsibilities?: string
  experienceType?: string
  referenceContact?: string
  proofDocumentUrl?: string[]
}

// 奖项
export interface Award {
  awardName: string
  awardingOrganization: string
  awardDate: string
  description?: string
  certificateUrl?: string[]
  awardCategory?: string
  priority?: number
}

// 认证
export interface Certification {
  certificationName: string
  issuingOrganization: string
  certificationNumber?: string
  issueDate?: string
  expirationDate?: string
  certificateImageUrl?: string[]
}

// 预约时间段
export interface CoachSchedule {
  id: number
  coachId: string
  scheduleDate: string
  startTime: string
  endTime: string
  maxStudents: number
  currentStudents: number
  price: number
  address?: string
  area?: string
  longitude?: number
  latitude?: number
  repeatType: number
  repeatEndDate?: string
  status: number
  remark?: string
}

// 设置预约时间请求
export interface SetScheduleRequest {
  head?: {
    userLongitude?: number
    userLatitude?: number
  }
  coachId: string
  schedules: ScheduleItem[]
}

export interface ScheduleItem {
  scheduleDate: string
  startTime: string
  endTime: string
  maxStudents?: number
  address?: string
  area?: string
  longitude?: number
  latitude?: number
  repeatType?: number
  repeatEndDate?: string
  status?: number
  remark?: string
}

// 教练查询参数（与 queryByAll 一致）
export interface CoachQueryParams {
  head?: {
    clientId?: string
    userId?: string
    userLongitude?: number
    userLatitude?: number
  }
  cityId?: number
  cityName?: string
  area?: string
  /** 区域/商圈ID（Long，关联 qdd_area.id，queryByAll 优先使用） */
  areaId?: number
  domainId?: string
  sportTypeId?: number
  /** 手机号（queryByAll 按教练关联用户手机号模糊匹配） */
  phone?: string
  /** 是否认证（0：未认证/待审核，1：已认证；待审核列表传 isVerified=0） */
  isVerified?: number
  pageNum?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: string
  maxDistance?: number
}
