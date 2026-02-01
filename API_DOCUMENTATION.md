# 用户登录和注册接口文档

**文档版本**: v1.5.3  
**最后更新**: 2026-02-01

## 基础路径
本文档包含多个模块，各接口完整路径见各节：用户 `/user`、教练 `/coach`、教练注册 `/coach/registration`、预约 `/book`、订单 `/order`、领域 `/domain`、统计 `/statistics`。

## 1. 发送验证码

### 接口地址
```
POST /user/sendCode
```

### 请求参数
- **方式**: Query参数或Form参数
- **参数名**: `phone`
- **类型**: String
- **说明**: 手机号或邮箱（支持手机号和邮箱发送验证码）

### 请求示例
```bash
# 手机号
POST /user/sendCode?phone=13800138000

# 邮箱
POST /user/sendCode?phone=user@example.com
```

### 响应示例
```json
{
  "success": true,
  "data": "验证码发送成功"
}
```

---

## 2. 用户登录

### 接口地址
```
POST /user/login
```

### 请求方式
Content-Type: `application/json`

### 请求体结构
```json
{
  "head": {
    "clientId": "客户端ID（可选）",
    "userId": "用户ID（可选）",
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "phone|email|username",
  "phone": "手机号（loginType为phone时必填）",
  "email": "邮箱（loginType为email时必填）",
  "username": "用户名（loginType为username时必填）",
  "code": "验证码（验证码登录时必填）",
  "password": "密码（密码登录时必填）"
}
```

### 登录方式说明

#### 方式1: 手机号验证码登录
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "phone",
  "phone": "13800138000",
  "code": "123456",
  "username": "可选用户名（用于创建新用户时的用户名）"
}
```

#### 方式2: 手机号密码登录
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "phone",
  "phone": "13800138000",
  "password": "your_password"
}
```

#### 方式3: 邮箱验证码登录
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "email",
  "email": "user@example.com",
  "code": "123456",
  "username": "可选用户名（用于创建新用户时的用户名）"
}
```

#### 方式4: 邮箱密码登录
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "email",
  "email": "user@example.com",
  "password": "your_password"
}
```

#### 方式5: 用户名密码登录
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "loginType": "username",
  "username": "your_username",
  "password": "your_password"
}
```

### 响应示例
```json
{
  "success": true,
  "data": "token字符串"
}
```

### 错误响应示例
```json
{
  "success": false,
  "errorMsg": "手机号格式不正确！"
}
```

---

## 3. 微信登录

### 接口地址
```
POST /user/wechatLogin
```

### 请求方式
Content-Type: `application/json`

### 请求体结构
```json
{
  "head": {
    "clientId": "客户端ID（可选）",
    "userId": "用户ID（可选）",
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "code": "微信授权码（code和openid二选一，建议使用openid）",
  "openid": "微信OpenID（必填，如果前端已经通过code获取了openid）",
  "unionid": "微信UnionID（可选）",
  "username": "微信用户名（可选）",
  "avatar": "微信头像URL（可选）",
  "gender": 0
}
```

### 字段说明
- `code`: 微信授权码（可选），如果只提供code，后端会提示需要先通过code获取openid
- `openid`: 微信OpenID（必填），微信小程序/公众号用户的唯一标识
- `unionid`: 微信UnionID（可选），微信开放平台统一用户标识，用于跨应用识别同一用户
- `username`: 微信用户名（可选），如果提供则会在创建或更新用户时使用（原 username 和 nickname 已合并为 username）
- `avatar`: 微信头像URL（可选），如果提供则会在创建或更新用户时使用
- `gender`: 微信性别（可选），0：未知，1：男，2：女（系统会自动转换为：0：男，1：女）

### 请求示例

#### 方式1: 使用openid登录（推荐）
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "openid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
  "unionid": "oTmGYjiMMHvA2a2HXvUhHhFhDw",
  "username": "微信用户",
  "avatar": "https://wx.qlogo.cn/mmopen/xxx",
  "gender": 1
}
```

#### 方式2: 仅使用openid登录（最少参数）
```json
{
  "openid": "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o"
}
```

### 响应示例
```json
{
  "success": true,
  "data": "token字符串"
}
```

### 错误响应示例
```json
{
  "success": false,
  "errorMsg": "微信授权码(code)或OpenID不能为空"
}
```

### 注意事项
1. **推荐使用openid**：建议前端先通过微信API（`https://api.weixin.qq.com/sns/jscode2session`）获取openid后再调用登录接口
2. **自动创建用户**：如果用户不存在，系统会自动创建新用户
3. **自动更新信息**：如果用户已存在，系统会自动更新用户的openid、unionid、用户名、头像等信息
4. **性别转换**：微信性别（0：未知，1：男，2：女）会自动转换为系统性别（0：男，1：女）
5. **位置信息**：如果head中提供了userLongitude和userLatitude，会自动保存到用户信息中
6. **兼容性**：系统会兼容旧数据，如果openid字段为空，会尝试通过cid字段查询

---

## 4. 用户注册

### 接口地址
```
POST /user/register
```

### 请求方式
Content-Type: `application/json`

### 请求体结构
```json
{
  "head": {
    "clientId": "客户端ID（可选）",
    "userId": "用户ID（可选）",
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "username": "用户名（必填）",
  "phone": "手机号（与email二选一）",
  "email": "邮箱（与phone二选一）",
  "password": "密码（必填）",
  "confirmPassword": "确认密码（必填）",
  "code": "验证码（必填）",
  "gender": 0,
  "cityId": 1,
  "cityName": "上海",
  "longitude": 121.473701,
  "latitude": 31.230416
}
```

### 请求示例

#### 手机号注册
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "username": "testuser",
  "phone": "13800138000",
  "password": "123456",
  "confirmPassword": "123456",
  "code": "123456",
  "gender": 0,
  "cityId": 1,
  "cityName": "上海",
  "longitude": 121.473701,
  "latitude": 31.230416
}
```

#### 邮箱注册
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "username": "testuser",
  "email": "user@example.com",
  "password": "123456",
  "confirmPassword": "123456",
  "code": "123456",
  "gender": 1,
  "cityId": 1,
  "cityName": "上海",
  "longitude": 121.473701,
  "latitude": 31.230416
}
```

### 响应示例
```json
{
  "success": true,
  "data": "注册成功"
}
```

### 错误响应示例
```json
{
  "success": false,
  "errorMsg": "用户名已存在"
}
```

---

## 5. 用户登出

### 接口地址
```
POST /user/logout
```

### 请求头
```
authorization: token字符串
```

### 请求示例
```bash
POST /user/logout
Headers:
  authorization: your_token_here
```

### 响应示例
```json
{
  "success": true,
  "data": "登出成功"
}
```

---

## 6. 获取当前用户信息

### 接口地址
```
GET /user/me
```

### 请求头
```
authorization: token字符串
```

### 响应示例
```json
{
  "success": true,
  "data": {
    "userId": "用户ID（String类型，业务标识符）",
    "username": "用户名",
    "avatar": "头像URL",
    "phone": "手机号",
    "email": "邮箱",
    "gender": 0,
    "cityId": 1,
    "cityName": "上海",
    "coachId": "教练ID（如果用户注册为教练则有值，否则为null，String类型）"
  }
}
```

---

## 字段说明

### Head 对象字段
- `clientId`: 客户端ID（可选）
- `userId`: 用户ID（可选）
- `userLongitude`: 用户经度（可选）
- `userLatitude`: 用户纬度（可选）

### 登录类型（loginType）
- `phone`: 手机号登录
- `email`: 邮箱登录
- `username`: 用户名登录

### 性别（gender）
- `0`: 男
- `1`: 女

### 状态码说明
- `success: true`: 请求成功
- `success: false`: 请求失败，查看 `errorMsg` 了解失败原因

---

## 注意事项

1. **验证码登录**：如果用户不存在，系统会自动创建新用户
2. **密码登录**：用户必须已存在，否则返回"用户不存在"
3. **验证码格式**：6位数字或字母
4. **手机号格式**：必须符合中国手机号格式（11位数字，以1开头）
5. **邮箱格式**：标准邮箱格式
6. **密码要求**：4-32位的字母、数字、下划线
7. **用户名**：登录时如果提供username，在验证码登录创建新用户时会使用该用户名（原 username 和 nickname 已合并为 username）
8. **coachId**：登录后返回的token中包含coachId信息，如果用户注册为教练则有值

## 7. 教练注册初始化

### 接口地址
```
POST /coach/registration/init
```

### 请求方式
Content-Type: `application/json`

### 请求头
```
authorization: token字符串（可选，如果提供则返回用户信息）
```

### 请求体
无需请求体（可不传 body，或传空对象 `{}`）。

### 响应示例

**成功响应（带用户信息）：**
```json
{
  "success": true,
  "data": {
    "sportInfos": [
      { "id": 1, "name": "羽毛球", "domainName": "球类运动", "domainId": "1" },
      { "id": 2, "name": "乒乓球", "domainName": "球类运动", "domainId": "1" },
      { "id": 23, "name": "哈他瑜伽", "domainName": "瑜伽", "domainId": "4" }
    ],
    "userInfo": {
      "userId": "user_001",
      "username": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "phone": "13800138000",
      "email": "user@example.com",
      "gender": 0,
      "cityId": 1,
      "cityName": "北京",
      "coachId": "coach_001"
    }
  }
}
```

**成功响应（无用户信息，未提供 token 或 token 无效）：**
```json
{
  "success": true,
  "data": {
    "sportInfos": [
      { "id": 1, "name": "羽毛球", "domainName": "球类运动", "domainId": "1" }
    ],
    "userInfo": null
  }
}
```

### 响应字段说明

- `sportInfos`: 运动类型列表（数组），每项包含 `id`（Long）、`name`（类型名称）、`domainName`（大领域名称）、`domainId`（大领域ID）
- `userInfo`: 用户信息对象（若提供有效 token 则有值，否则为 null）
  - `userId`: 用户ID（String 类型，业务标识符）
  - `username`: 用户名
  - `avatar`: 头像 URL
  - `phone`: 手机号
  - `email`: 邮箱
  - `gender`: 性别（0：男，1：女）
  - `cityId`: 城市 ID
  - `cityName`: 城市名称
  - `coachId`: 教练 ID（String 类型，若用户已注册为教练则有值）

### 注意事项

1. **token 可选**：如果不提供 token，接口仍会返回领域信息，但 `userInfo` 为 `null`
2. **token 无效**：如果提供的 token 无效或已过期，接口仍会返回领域信息，但 `userInfo` 为 `null`
3. **用户信息获取失败不影响领域信息返回**：即使获取用户信息失败，接口仍会返回领域信息

---

## 8. 教练注册

### 接口地址
```
POST /coach/registration/register
```

### 请求方式
Content-Type: `application/json`

### 请求头
```
authorization: token字符串（必须）
```

### 请求体结构
```json
{
  "head": {
    "clientId": "客户端ID（可选）",
    "userId": "用户ID（可选）",
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "userInfo": {
    "userId": "用户ID（必填，String类型，业务标识符）",
    "username": "用户姓名（必填，将作为教练的显示名称）",
    "avatar": "头像URL（可选）",
    "phone": "手机号（可选）",
    "email": "邮箱（可选）",
    "gender": 0,
    "cityId": 1,
    "realName":"真实姓名",
    "cityName": "城市名称（可选）"
  },
  "coachBasicInfo": {
    "avatar": "头像URL（可选，如果userInfo中未提供）",
    "introduction": "个人介绍（可选）",
    "experienceYears": 5,
    "sportTypeIds": [1, 2],
    "teachingAreas": ["浦东新区", "黄浦区"],
    "hourlyRate": 200.00,
    "height": 180.00,
    "weight": 75.00,
    "coachAddress": "工作地址（可选）",
    "areaId": 1,
    "coachArea": "工作商圈（可选，当 areaId 有值时以 qdd_area 为准）",
    "coachLongitude": 121.473701,
    "coachLatitude": 31.230416
  },
  "educations": [
    {
      "schoolName": "院校名称（必填）",
      "schoolId": 10001,
      "degreeType": "BACHELOR",
      "fieldOfStudy": "体育教育",
      "startDate": "2015-09-01",
      "endDate": "2019-06-30",
      "isGraduated": true,
      "description": "教育经历描述（可选）",
      "relevantCourses": "相关课程（可选）",
      "isHighestDegree": true,
      "priority": 1,
      "diplomaUrl": ["毕业证书URL（可选）"],
      "transcriptUrl": ["成绩单URL（可选）"]
    }
  ],
  "experiences": [
    {
      "organizationName": "机构名称（必填）",
      "position": "职位（必填）",
      "startDate": "2019-07-01",
      "endDate": "2024-12-31",
      "isCurrent": true,
      "description": "工作描述（可选）",
      "responsibilities": "主要职责（可选）",
      "experienceType": "full_time",
      "referenceContact": "证明人联系方式（可选）",
      "proofDocumentUrl": ["证明文件URL（可选）"]
    }
  ],
  "awards": [
    {
      "awardName": "奖项名称（必填）",
      "awardingOrganization": "颁奖机构（必填）",
      "awardDate": "2020-01-01",
      "description": "奖项描述（可选）",
      "certificateUrl": ["证书URL（可选）"],
      "awardCategory": "competition",
      "priority": 1
    }
  ],
  "certifications": [
    {
      "certificationName": "证书名称（必填）",
      "issuingOrganization": "发证机构（必填）",
      "certificationNumber": "证书编号（可选）",
      "issueDate": "2020-01-01",
      "expirationDate": "2025-01-01",
      "certificateImageUrl": ["证书图片URL（可选）"]
    }
  ]
}
```

### 字段说明

#### userInfo 字段
- `userId`: 用户ID（必填，String类型，业务标识符）
- `username`: 教练姓名（必填，将作为教练的显示名称，会同步到用户表和教练表）
- `avatar`: 头像URL（可选，如果coachBasicInfo中也提供了，优先使用coachBasicInfo中的）
- `phone`: 手机号（可选）
- `email`: 邮箱（可选）
- `gender`: 性别（0：男，1：女，可选）
- `cityId`: 城市ID（可选，关联 **qdd_city.id**，有值时城市名称从城市表解析）
- `cityName`: 城市名称（可选，当未传 cityId 时使用）

#### coachBasicInfo 字段
- `avatar`: 头像URL（可选，如果userInfo中未提供则使用此字段）
- `introduction`: 个人介绍（可选）
- `experienceYears`: 教学经验年数（可选）
- `sportTypeIds`: 运动类型ID数组（必填，Integer数组，例如：[1, 2, 3]）
- `teachingAreas`: 教学区域数组（可选，String数组，例如：["浦东新区", "黄浦区"]）
- `hourlyRate`: 每小时收费标准（可选，BigDecimal）
- `height`: 身高（可选，厘米，BigDecimal）
- `weight`: 体重（可选，公斤，BigDecimal）
- `coachAddress`: 工作地址（可选，会同步到用户表的address字段）
- `areaId`: 工作商圈ID（可选，Long类型，关联 **qdd_area.id**，有值时商圈名称从地区表解析，会同步到用户表 area_id、教练表 area_id）
- `coachArea`: 工作商圈名称（可选，当未传 areaId 时使用，会同步到用户表 area、教练表 c_area）
- `coachLongitude`: 工作经度（可选，会同步到用户表的lon字段）
- `coachLatitude`: 工作纬度（可选，会同步到用户表的lat字段）

#### educations 字段（可选）
- `schoolName`: 院校名称（必填）
- `schoolId`: 院校ID（必填，Long类型）
- `degreeType`: 学位类型（可选，PRIMARY, JUNIOR, HS, VOC, TECH_SEC, ASSOC, BACHELOR, MASTER, PHD, POSTDOC, OTHER）
- `fieldOfStudy`: 专业领域（可选）
- `startDate`: 入学日期（必填，格式：YYYY-MM-DD）
- `endDate`: 毕业日期（可选，格式：YYYY-MM-DD）
- `isGraduated`: 是否已毕业（可选，默认false）
- `description`: 教育经历描述（可选）
- `relevantCourses`: 相关课程（可选）
- `isHighestDegree`: 是否是最高学历（可选，默认false）
- `priority`: 优先级（可选，用于排序，数值越小优先级越高，默认0）
- `diplomaUrl`: 毕业证书URL列表（可选，String数组）
- `transcriptUrl`: 成绩单URL列表（可选，String数组）

#### experiences 字段（可选）
- `organizationName`: 机构名称（必填）
- `position`: 职位（必填）
- `startDate`: 开始日期（必填，格式：YYYY-MM-DD）
- `endDate`: 结束日期（可选，格式：YYYY-MM-DD，为空表示至今）
- `isCurrent`: 是否当前职位（可选，默认false）
- `description`: 工作描述（可选）
- `responsibilities`: 主要职责（可选）
- `experienceType`: 工作类型（可选，full_time, part_time, freelance, internship, volunteer）
- `referenceContact`: 证明人联系方式（可选）
- `proofDocumentUrl`: 证明文件URL列表（可选，String数组）

#### awards 字段（可选）
- `awardName`: 奖项名称（必填）
- `awardingOrganization`: 颁奖机构（必填）
- `awardDate`: 获奖日期（必填，格式：YYYY-MM-DD）
- `description`: 奖项描述（可选）
- `certificateUrl`: 证书URL列表（可选，String数组）
- `awardCategory`: 奖项类别（可选，competition, teaching, contribution, innovation, other）
- `priority`: 优先级（可选，用于排序，数值越小优先级越高，默认0）

#### certifications 字段（可选）
- `certificationName`: 证书名称（必填）
- `issuingOrganization`: 发证机构（必填）
- `certificationNumber`: 证书编号（可选）
- `issueDate`: 发证日期（可选，格式：YYYY-MM-DD）
- `expirationDate`: 过期日期（可选，格式：YYYY-MM-DD）
- `certificateImageUrl`: 证书图片URL列表（可选，String数组）

### 响应示例
```json
{
  "success": true,
  "data": "教练ID"
}
```

### 注意事项

1. **用户信息和教练信息合并**：
   - 注册教练时，系统会将教练信息合并到用户表中
   - 如果用户不存在，会创建新用户记录，并将教练信息（姓名、头像、地址、位置等）写入用户表
   - 如果用户已存在，会更新用户信息，将教练信息同步到用户表
   - 用户表的 `coachId` 字段会设置为新生成的教练ID
   - 用户表的 `username` 字段会使用 `userInfo.username`（教练姓名）
   - 用户表的 `address`、`area`、`lon`、`lat` 字段会使用 `coachBasicInfo` 中的工作地址和位置信息

2. **必填字段**：
   - `userInfo.userId`：用户ID（必填）
   - `userInfo.username`：教练姓名（必填，会同步到用户表和教练表）
   - `coachBasicInfo.sportTypeIds`：运动类型ID数组（必填，Integer数组）

3. **字段优先级**：
   - 头像：如果 `coachBasicInfo.avatar` 存在，优先使用；否则使用 `userInfo.avatar`
   - 地址和位置信息：优先使用 `coachBasicInfo` 中的字段

4. **防止重复创建用户**：
   - 系统使用双重检查机制，防止并发情况下重复创建用户
   - 如果保存用户时发生主键冲突，系统会自动重新查询并更新用户信息

5. **数据一致性**：
   - 用户表和教练表的数据会保持一致
   - 教练的姓名、头像、地址等信息会同步到用户表

6. **运动类型ID**：
   - `sportTypeIds` 必须是有效的运动类型ID（Integer数组）
   - 运动类型ID可以通过 `/coach/registration/init` 接口获取，对应 `qdd_sport_info` 表的 `id` 字段

7. **可选字段**：
   - `educations`、`experiences`、`awards`、`certifications` 都是可选字段，可以为空数组或省略
   - 如果提供了这些字段，系统会保存相应的记录

---

## 9. 教练查询接口（合并了列表和详情功能）

### 9.1 查询教练详情

#### 接口地址
```
POST /coach/queryDetail
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（可选）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "coachId": "教练ID（必填，String类型，业务标识符）"
}
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "username": "用户名",
    "avatar": "头像URL",
    "baseInfo": {
      "coachId": "教练ID（String类型，业务标识符）",
      "introduction": "个人介绍",
      "experienceYears": 5,
      "sportTypeIds": [1, 2],
      "teachingAreas": ["浦东新区"],
      "hourlyRate": 200.00,
      "rating": 4.8,
      "totalReviews": 100,
      "totalStudents": 50,
      "distance": 2.5,
      "cityName": "上海",
      "coachArea": "陆家嘴",
      "coachAddress": "工作地址",
      "height": 180.00,
      "weight": 75.00,
      "coachLongitude": 121.473701,
      "coachLatitude": 31.230416
    },
    "professional": {
      "certifications": [],
      "awards": [],
      "educations": [],
      "experiences": []
    },
    "bestReview": {
      "userName": "评价用户姓名",
      "userAvatar": "评价用户头像",
      "rating": 5,
      "content": "评价内容",
      "tags": ["标签1", "标签2"],
      "images": []
    },
    "courseSchedules": [],
    "coachSchedules": [
      {
        "id": 1,
        "coachId": "教练ID（String类型，业务标识符）",
        "scheduleDate": "2024-01-15",
        "startTime": "09:00:00",
        "endTime": "11:00:00",
        "maxStudents": 5,
        "currentStudents": 2,
        "price": 200.00,
        "address": "教学地点",
        "area": "商圈",
        "longitude": 121.473701,
        "latitude": 31.230416,
        "repeatType": 0,
        "repeatEndDate": null,
        "status": 1,
        "remark": "备注说明"
      }
    ],
    "coachDailies": [],
    "isVerified": 1,
    "isOnline": 1,
    "status": 1
  }
}
```

#### 响应字段说明
- `username`: 用户名
- `avatar`: 头像URL
- `baseInfo`: 教练基础信息对象
  - `coachId`: 教练ID（String类型，业务标识符）
  - `introduction`: 个人介绍
  - `experienceYears`: 经验年限
  - `sportTypeIds`: 运动类型ID列表
  - `teachingAreas`: 教学区域列表
  - `hourlyRate`: 时薪
  - `rating`: 评分
  - `totalReviews`: 总评价数
  - `totalStudents`: 总学员数
  - `distance`: 距离（公里，如果提供了用户位置）
  - `cityName`: 城市名称
  - `coachArea`: 教练区域
  - `coachAddress`: 教练地址
  - `height`: 身高
  - `weight`: 体重
  - `coachLongitude`: 教练经度
  - `coachLatitude`: 教练纬度
- `professional`: 教练专业信息对象
  - `certifications`: 认证信息列表
  - `awards`: 奖项列表
  - `educations`: 教育背景列表
  - `experiences`: 工作经历列表
- `bestReview`: 最佳评价对象
- `courseSchedules`: 课程时间安排列表（已废弃）
- `coachSchedules`: 教练可预约时间段列表
  - `id`: 时间安排ID（Long类型，自增主键）
  - `coachId`: 教练ID（String类型，业务标识符）
  - `scheduleDate`: 安排日期（格式：yyyy-MM-dd）
  - `startTime`: 开始时间（格式：HH:mm:ss）
  - `endTime`: 结束时间（格式：HH:mm:ss）
  - `maxStudents`: 该时间段最大学员数
  - `currentStudents`: 该时间段当前学员数
  - `price`: 该时间段价格
  - `address`: 教学地点
  - `area`: 教学地点商圈
  - `longitude`: 教学地点经度
  - `latitude`: 教学地点纬度
  - `repeatType`: 重复类型（0：不重复，1：每天，2：每周，3：每月）
  - `repeatEndDate`: 重复结束日期
  - `status`: 状态（0：不可预约，1：可预约，2：已满员，3：已取消，4：已过期）
  - `remark`: 备注说明
- `coachDailies`: 教练日常内容列表
- `isVerified`: 是否认证（0：未认证，1：已认证）
- `isOnline`: 是否在线（0：离线，1：在线）
- `status`: 状态（0：禁用，1：启用）

### 9.2 教练列表查询（queryByAll）

支持按**城市、运动类型、区域、手机号、是否认证**等组合筛选，所有筛选参数均为可选；不传任何筛选条件时返回所有教练。多个条件之间为 **AND** 关系。

- **全国**：请求时传 `cityId: 0` 或 `cityId: -1` 表示全国，接口**不按城市筛选**，返回**所有城市**的教练；城市列表来自 `/domain/getAllFilterTypes`，其中「全国」为 `cityId: 0`。
- **手机号**：传 `phone` 时按教练关联用户（qdd_user）的手机号**模糊匹配**，可与城市、运动类型、区域等条件同时使用。
- **是否认证**：传 `isVerified: 0` 可只查**未认证**教练（含未启用 status=0 的教练，便于审核列表），传 `1` 可只查已认证教练；不传则不按认证状态筛选，且默认只返回**启用**教练（status=1）。

#### 接口地址
```
POST /coach/queryByAll
```

#### 请求方式
Content-Type: `application/json`

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "cityId": 1,
  "cityName": "上海",
  "domainId": "1",
  "sportTypeId": 1,
  "areaId": 1,
  "area": "陆家嘴",
  "phone": "138",
  "isVerified": 0,
  "pageNum": 1,
  "pageSize": 10,
  "sortBy": "rating",
  "sortOrder": "desc",
  "maxDistance": 10.0
}
```

#### 请求字段说明（均为可选）
- **城市**：`cityId`（Integer，关联 **qdd_city.id**；**0 或 -1 表示全国**，不按城市筛选；getAllFilterTypes 返回的“全国”为 cityId=0）、`cityName`（城市名称，仅当未传 cityId 时按名称筛选）；传具体 cityId（≥1）时按用户所在城市筛选教练
- **运动类型**：`domainId`（String，大领域ID）、`sportTypeId`（Integer，具体运动类型ID，优先级高于 domainId）；可只传 domainId、只传 sportTypeId 或同时传（会校验 sportTypeId 是否属于 domainId）；都未传则不按类型筛选
- **区域**：`areaId`（Long，关联 **qdd_area.id**，优先）、`area`（地区/商圈名称，当 areaId 为空时按教学区域 t_areas 模糊匹配）；二选一或同时传
- **手机号**：`phone`（String，可选），按教练关联用户（qdd_user）的手机号**模糊匹配**，支持部分号码查询
- **是否认证**：`isVerified`（Integer，可选），`0`=未认证、`1`=已认证；不传则不按认证状态筛选且仅返回启用教练；传 `0` 时返回未认证教练（含未启用教练，便于审核）
- **分页与排序**：`pageNum`（默认 1）、`pageSize`（默认 10）、`sortBy`（rating / price / distance）、`sortOrder`（asc / desc）
- **位置**：`head.userLongitude`、`head.userLatitude`（用于距离计算）、`maxDistance`（最大距离，公里）

### 响应示例
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "username": "用户名",
        "gender": 0,
        "cityId": 1,
        "coachId": "教练ID（String类型，业务标识符）",
        "avatar": "头像URL",
        "introduction": "个人介绍",
        "experienceYears": 5,
        "hourlyRate": 200.00,
        "rating": 4.8,
        "totalReviews": 100,
        "coachTypeName": "篮球教练",
        "certifications": [],
        "awards": [],
        "isVerified": 1,
        "isOnline": 1,
        "status": 1,
        "sportTypeIds": [1, 2, 3]
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

### 响应字段说明
- `username`: 用户名
- `gender`: 性别（0：男，1：女）
- `cityId`: 城市ID
- `coachId`: 教练ID（String类型，业务标识符）
- `avatar`: 头像URL
- `introduction`: 个人介绍
- `experienceYears`: 教学经验年数
- `hourlyRate`: 每小时收费标准
- `rating`: 综合评分（0-5分）
- `totalReviews`: 总评价数
- `coachTypeName`: 教练类型名称（格式：运动类型+教练，例如"篮球教练"）
- `certifications`: 资格证书列表
- `awards`: 荣誉奖项列表
- `isVerified`: 是否认证（0：未认证，1：已认证）
- `isOnline`: 是否在线（0：离线，1：在线）
- `status`: 状态（0：禁用，1：启用）
- `sportTypeIds`: 运动类型ID列表（Integer数组）

### 9.3 更新教练认证状态（verify）

用于更新教练的 `isVerified`（0=未认证，1=已认证）及可选 `status`（0=禁用，1=启用），例如审核通过后将其设为已认证并启用。

#### 接口地址
```
POST /coach/verify
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（可选）
```

#### 请求体
```json
{
  "coachId": "教练ID（必填，String类型，业务标识符）",
  "isVerified": 1,
  "status": 1
}
```

#### 请求字段说明
- `coachId`: 教练ID（必填，String类型，业务标识符）
- `isVerified`: 是否认证（必填，Integer）：`0`=未认证，`1`=已认证
- `status`: 状态（可选，Integer）：`0`=禁用，`1`=启用；不传则不更新 status

#### 响应示例
- 成功：`{ "success": true, "data": null }`
- 失败：`{ "success": false, "message": "错误信息" }`（如教练ID为空、isVerified 非 0/1、status 非 0/1、教练不存在等）

---

## 10. 教练预约时间管理

### 10.1 查询教练可预约时间（可订接口）

#### 接口地址
```
POST /book/reservation
```

#### 请求方式
Content-Type: `application/json`

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "coachId": "教练ID（必填，String类型，业务标识符）",
  "startDate": "2025-01-20",
  "endDate": "2025-01-30"
}
```

#### 字段说明
- `coachId`: 教练ID（必填，String类型，业务标识符）
- `startDate`: 开始日期（可选，格式：YYYY-MM-DD，用于过滤指定日期范围）
- `endDate`: 结束日期（可选，格式：YYYY-MM-DD，用于过滤指定日期范围）

#### 请求示例

**示例1：查询所有可预约时间**
```json
{
  "coachId": "coach_001"
}
```

**示例2：查询指定日期范围内的可预约时间**
```json
{
  "coachId": "coach_001",
  "startDate": "2025-01-20",
  "endDate": "2025-01-30"
}
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "coachId": "教练ID（String类型，业务标识符）",
    "schedules": [
      {
        "scheduleId": 1,
        "scheduleDate": "2025-01-20",
        "startTime": "09:00:00",
        "endTime": "10:00:00",
        "price": 200.00,
        "status": 1,
        "remark": "备注说明"
      },
      {
        "scheduleId": 2,
        "scheduleDate": "2025-01-21",
        "startTime": "14:00:00",
        "endTime": "16:00:00",
        "price": 300.00,
        "status": 1,
        "remark": "备注说明2"
      }
    ],
    "totalPrice": 500.00
  }
}
```

#### 响应字段说明
- `coachId`: 教练ID（String类型，业务标识符）
- `schedules`: 可预约时间段列表（数组）
  - `scheduleId`: 时间段ID（Long类型）
  - `scheduleDate`: 安排日期（格式：YYYY-MM-DD）
  - `startTime`: 开始时间（格式：HH:mm:ss）
  - `endTime`: 结束时间（格式：HH:mm:ss）
  - `price`: 价格
  - `status`: 状态（1：可预约）
  - `remark`: 备注说明
- `totalPrice`: 所有时间段的总价格

#### 注意事项
- 只返回可预约状态（status = 1）的时间段
- 如果提供了 `startDate` 和 `endDate`，只返回该日期范围内的可预约时间段
- 结果按日期和时间升序排序

### 10.2 教练管理预约时间（教练专用）

#### 10.2.1 设置预约时间（支持批量）

##### 接口地址
```
POST /coach/setSchedule
```

##### 请求方式
Content-Type: `application/json`

##### 请求头
```
authorization: token字符串（必须）
```

##### 请求体（coachId在外层，支持一次设置多个预约时间段）
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "coachId": "教练ID（必填，String类型，业务标识符）",
  "schedules": [
    {
  "scheduleDate": "2025-01-20",
  "startTime": "09:00:00",
  "endTime": "10:00:00",
  "maxStudents": 1,
  "address": "教学地点",
  "area": "教学地点商圈",
  "longitude": 121.473701,
  "latitude": 31.230416,
  "repeatType": 0,
  "repeatEndDate": "2025-02-20",
      "status": 1,
  "remark": "备注说明"
    },
    {
      "scheduleDate": "2025-01-21",
      "startTime": "14:00:00",
      "endTime": "16:00:00",
      "maxStudents": 2,
      "address": "教学地点2",
      "area": "教学地点商圈2",
      "longitude": 121.473701,
      "latitude": 31.230416,
      "repeatType": 0,
      "status": 1,
      "remark": "备注说明2"
    }
  ]
}
```

##### 字段说明

**外层字段：**
- `coachId`: 教练ID（必填，String类型，业务标识符）
- `hourlyRate`: 每小时收费（可选，BigDecimal类型，会更新到CoachEntity.hourlyRate字段，并用于设置每个schedule的price字段）

**schedules 数组中的字段：**
- `scheduleDate`: 安排日期（必填，格式：YYYY-MM-DD）
- `startTime`: 开始时间（必填，格式：HH:mm:ss）
- `endTime`: 结束时间（必填，格式：HH:mm:ss）
- `maxStudents`: 该时间段最大学员数（默认1）
- `address`: 教学地点（可选）
- `area`: 教学地点商圈（可选）
- `longitude`: 教学地点经度（可选）
- `latitude`: 教学地点纬度（可选）
- `repeatType`: 重复类型（0：不重复，1：每天，2：每周，3：每月，默认0）
- `repeatEndDate`: 重复结束日期（可选，格式：YYYY-MM-DD）
- `status`: 状态（可选，0：不可预约，1：可预约，2：已满员，3：已取消，4：已过期，默认1）
  - **重要**：只有 `status` 为 1（可预约）的时间段才会插入数据库
  - 如果 `status` 为 0、2、3、4，该时间段将被跳过，不会插入数据库
- `remark`: 备注说明（可选）

##### 响应示例
```json
{
  "success": true,
  "data": [
    {
    "id": 1,
      "coachId": "教练ID（String类型，业务标识符）",
    "scheduleDate": "2025-01-20",
    "startTime": "09:00:00",
    "endTime": "10:00:00",
    "status": 1
    },
    {
      "id": 2,
      "coachId": "教练ID（String类型，业务标识符）",
      "scheduleDate": "2025-01-21",
      "startTime": "14:00:00",
      "endTime": "16:00:00",
    "status": 1
  }
  ]
}
```

##### 注意事项
- `coachId` 在外层，所有 `schedules` 数组中的时间段都属于该教练
- 支持一次设置多个预约时间段，所有时间段共享同一个 `coachId`
- `hourlyRate` 字段（可选）：
  - 如果提供了 `hourlyRate`，会更新 `CoachEntity` 的 `hourlyRate` 字段
  - 对于 `status` 为 1（可预约）的时间段，会自动使用 `hourlyRate` 赋值给 `price` 字段
- `status` 字段（可选，默认1）：
  - 只有 `status` 为 1（可预约）的时间段才会插入数据库
  - 如果 `status` 为 0、2、3、4，该时间段将被跳过，不会插入数据库
- **覆盖机制**：
  - 如果存在相同的时间段（相同的 `coachId`、`scheduleDate`、`startTime`、`endTime`），系统会自动覆盖更新该记录
  - 覆盖时会保留原有的 `currentStudents`（当前学员数），更新其他字段（如 `price`、`address`、`area` 等）
  - 如果不存在相同的时间段，则插入新记录
- 如果部分时间段设置失败，会返回成功创建或更新的时间段列表，失败信息会记录在日志中
- 如果所有时间段都设置失败，会返回错误信息，包含每个失败时间段的具体原因

#### 10.2.2 更新预约时间状态（支持批量）

##### 接口地址
```
POST /coach/updateStatus
```

##### 请求方式
Content-Type: `application/json`

##### 请求头
```
authorization: token字符串（必须）
```

##### 请求体（数组格式，支持一次更新多个预约时间段的状态）
```json
[
  {
    "scheduleId": 1,
    "status": 1
  },
  {
    "scheduleId": 2,
    "status": 2
  },
  {
    "scheduleId": 3,
    "status": 0
  }
]
```

##### 字段说明
- `scheduleId`: 预约时间ID（必填，Long类型）
- `status`: 状态（必填，0：不可预约，1：可预约，2：已满员，3：已取消，4：已过期）

##### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "coachId": "教练ID（String类型，业务标识符）",
      "scheduleDate": "2025-01-20",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "status": 1
    },
    {
      "id": 2,
      "coachId": "教练ID（String类型，业务标识符）",
      "scheduleDate": "2025-01-21",
      "startTime": "14:00:00",
      "endTime": "16:00:00",
      "status": 2
    },
    {
      "id": 3,
      "coachId": "教练ID（String类型，业务标识符）",
      "scheduleDate": "2025-01-22",
      "startTime": "18:00:00",
      "endTime": "20:00:00",
      "status": 0
    }
  ]
}
```

##### 注意事项
- 支持一次更新多个预约时间段的状态，请求体为数组格式
- 如果部分请求失败，会返回成功更新的时间段列表，失败信息会记录在日志中
- 如果所有请求都失败，会返回错误信息，包含每个失败请求的具体原因

#### 10.2.3 查看教练已经被预约的时间段

##### 接口地址
```
POST /coach/initCoachSchedule
```

##### 请求方式
Content-Type: `application/json`

##### 请求头
```
authorization: token字符串（必须）
```

##### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "coachId": "教练ID（必填，String类型，业务标识符）",
  "startDate": "2025-01-20",
  "endDate": "2025-01-30"
}
```

##### 字段说明
- `coachId`: 教练ID（必填，String类型，业务标识符）
- `startDate`: 开始日期（必填，格式：YYYY-MM-DD）
- `endDate`: 结束日期（必填，格式：YYYY-MM-DD）

##### 响应示例
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "coachId": "教练ID（String类型，业务标识符）",
      "scheduleDate": "2025-01-20",
      "startTime": "09:00:00",
      "endTime": "10:00:00",
      "maxStudents": 1,
        "currentStudents": 1,
      "price": 200.00,
      "status": 1
      },
      {
        "id": 2,
        "coachId": "教练ID（String类型，业务标识符）",
        "scheduleDate": "2025-01-21",
        "startTime": "14:00:00",
        "endTime": "16:00:00",
        "maxStudents": 2,
        "currentStudents": 2,
        "price": 150.00,
        "status": 2
      },
      {
        "id": 3,
        "coachId": "教练ID（String类型，业务标识符）",
        "scheduleDate": "2025-01-22",
        "startTime": "18:00:00",
        "endTime": "20:00:00",
        "maxStudents": 1,
        "currentStudents": 0,
        "price": 125.00,
        "status": 3
      }
    ],
    "hourlyRate": 200.00
  }
}
```

##### 响应字段说明

**顶层字段：**
- `list`: 预约时间段列表（数组）
- `hourlyRate`: 每小时收费（从CoachEntity.hourlyRate获取，BigDecimal类型）

**list 数组中的字段：**
- `id`: 时间安排ID（Long类型，自增主键）
- `coachId`: 教练ID（String类型，业务标识符）
- `scheduleDate`: 安排日期（格式：YYYY-MM-DD）
- `startTime`: 开始时间（格式：HH:mm:ss）
- `endTime`: 结束时间（格式：HH:mm:ss）
- `maxStudents`: 该时间段最大学员数
- `currentStudents`: 该时间段当前已预约的学员数
- `price`: 该时间段价格（即每小时费用）
- `status`: 状态（0：不可预约，1：可预约，2：已满员，3：已取消，4：已过期）

##### 注意事项
- 返回所有已预约或被预约的时间段，包括：
  - `current_students > 0` 的时间段（有学员预约）
  - `status != 1` 的时间段（已满员、已取消、已过期等状态）
- 结果按日期和时间升序排序
- 如果指定日期范围内没有已预约或被预约的时间段，返回空数组
- `status` 字段会包含在响应中，表示时间段的当前状态

#### 10.2.4 删除预约时间

##### 接口地址
```
POST /coach/delete
```

##### 请求方式
Content-Type: `application/json`

##### 请求头
```
authorization: token字符串（必须）
```

##### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "scheduleId": 1,
  "coachId": "教练ID（必填，String类型，业务标识符，用于权限验证）"
}
```

##### 字段说明
- `scheduleId`: 预约时间ID（必填，Long类型）
- `coachId`: 教练ID（必填，String类型，业务标识符，用于权限验证）

##### 响应示例
```json
{
  "success": true,
  "data": {
    "list": []
  }
}
```

##### 响应字段说明

**顶层字段：**
- `list`: 预约时间段列表（数组，删除成功后返回空数组）

**list 数组中的字段说明（与 `initCoachSchedule` 接口的 `list` 字段结构一致）：**
- `id`: 时间安排ID（Long类型，自增主键）
- `coachId`: 教练ID（String类型，业务标识符）
- `scheduleDate`: 安排日期（格式：YYYY-MM-DD）
- `startTime`: 开始时间（格式：HH:mm:ss）
- `endTime`: 结束时间（格式：HH:mm:ss）
- `maxStudents`: 该时间段最大学员数
- `currentStudents`: 该时间段当前已预约的学员数
- `status`: 状态（0：不可预约，1：可预约，2：已满员，3：已取消，4：已过期）

##### 注意事项
- 删除成功后返回与 `initCoachSchedule` 相同的响应结构，但不包含 `hourlyRate` 字段
- `list` 字段在删除成功后返回空数组 `[]`
- 只能删除自己的预约时间（通过 `coachId` 进行权限验证）
- 如果该时间段已有预约（`currentStudents > 0`），无法删除，会返回错误信息
- 删除成功后，该时间段将从数据库中移除

---

## 通用说明

### Token验证
- 所有需要认证的接口必须在请求头中携带 `authorization` 字段
- Token格式：`authorization: your_token_here`
- Token过期时间：默认36000分钟（约25天）
- Token无效时会返回401状态码

### Head对象（可选）
所有POST请求都可以包含 `head` 对象：
```json
{
  "head": {
    "clientId": "客户端ID",
    "userId": "用户ID",
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  }
}
```

### 响应格式
所有接口统一返回格式：
```json
{
  "success": true/false,
  "data": "响应数据",
  "errorMsg": "错误信息（仅失败时返回）"
}
```

### 分页响应格式
```json
{
  "success": true,
  "data": {
    "records": [],
    "total": 100,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

---

## 注意事项

1. **验证码登录**：如果用户不存在，系统会自动创建新用户
2. **密码登录**：用户必须已存在，否则返回"用户不存在"
3. **验证码格式**：6位数字或字母
4. **手机号格式**：必须符合中国手机号格式（11位数字，以1开头）
5. **邮箱格式**：标准邮箱格式
6. **密码要求**：4-32位的字母、数字、下划线
7. **用户名**：登录时如果提供username，在验证码登录创建新用户时会使用该用户名（原 username 和 nickname 已合并为 username）
8. **coachId**：登录后返回的token中包含coachId信息，如果用户注册为教练则有值
9. **Token验证**：所有需要认证的接口都必须提供有效的token
10. **日期格式**：日期字段使用ISO格式（YYYY-MM-DD）或ISO日期时间格式（YYYY-MM-DDTHH:mm:ss）
11. **JSON字段**：某些字段需要传递JSON字符串格式
12. **坐标格式**：经纬度使用 WGS84 小数格式（如 121.473701）

## 11. 订单管理

### 11.1 创建订单

#### 接口地址
```
POST /order/create
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（必须）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "userId": "用户ID（必填）",
  "coachId": "教练ID（必填）",
  "scheduleIds": [1, 2, 3],
  "address": "预约地点（可选）",
  "area": "预约地点商圈（可选）",
  "longitude": 121.473701,
  "latitude": 31.230416,
  "paymentAmount": 500.00,
  "paymentMethod": 1,
  "contactPhone": "13800138000",
  "remark": "备注"
}
```

#### 字段说明
- `userId`: 用户ID（必填，String类型，业务标识符）
- `coachId`: 教练ID（必填，String类型，业务标识符）
- `scheduleIds`: 预约时间段ID数组（必填，Long类型数组，支持一次预约多个时间段，所有时间段必须属于同一个教练）
- `address`: 预约地点（可选，如果schedule中没有指定，可以自定义）
- `area`: 预约地点商圈（可选）
- `longitude`: 预约地点经度（可选）
- `latitude`: 预约地点纬度（可选）
- `paymentAmount`: 支付金额（必填，必须大于0）
- `paymentMethod`: 支付方式（1：微信，2：支付宝，3：银行卡，默认1）
- `contactPhone`: 联系电话（可选）
- `remark`: 备注（可选）

#### 响应示例
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNo": "ORD1234567890",
    "userId": "用户ID（String类型，业务标识符）",
    "userName": "张三",
    "coachId": "教练ID（String类型，业务标识符）",
    "coachName": "李教练",
    "coachPhone": "13800138000",
    "courseName": "预约课程",
    "courseType": 1,
    "originalPrice": 500.00,
    "actualPrice": 500.00,
    "discountAmount": 0.00,
    "paymentMethod": 1,
    "paymentStatus": 0,
    "orderStatus": 0,
    "orderAddress": "上海市浦东新区陆家嘴环路1000号",
    "orderArea": "陆家嘴",
    "orderLongitude": 121.473701,
    "orderLatitude": 31.230416,
    "contactPhone": "13800138000",
    "remark": "备注",
    "schedules": [
      {
        "scheduleId": 1,
        "scheduleDate": "2025-01-20",
        "startTime": "09:00:00",
        "endTime": "10:00:00",
        "price": 200.00,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "area": "陆家嘴",
        "longitude": 121.473701,
        "latitude": 31.230416
      },
      {
        "scheduleId": 2,
        "scheduleDate": "2025-01-21",
        "startTime": "14:00:00",
        "endTime": "15:30:00",
        "price": 150.00,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "area": "陆家嘴",
        "longitude": 121.473701,
        "latitude": 31.230416
      },
      {
        "scheduleId": 3,
        "scheduleDate": "2025-01-22",
        "startTime": "16:00:00",
        "endTime": "17:00:00",
        "price": 150.00,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "area": "陆家嘴",
        "longitude": 121.473701,
        "latitude": 31.230416
      }
    ]
  }
}
```

#### 响应字段说明
- `id`: 订单ID（Long类型，自增主键）
- `orderNo`: 订单号（String类型，唯一）
- `userId`: 用户ID（String类型，业务标识符）
- `userName`: 用户名（下单时的用户名，String类型）
- `coachId`: 教练ID（String类型，业务标识符）
- `coachName`: 教练姓名（下单时的教练姓名，String类型）
- `coachPhone`: 教练联系电话（下单时的教练联系电话，String类型）
- `courseName`: 课程名称（默认"预约课程"）
- `courseType`: 课程类型（1：一对一，2：小班课，3：大班课，4：在线课程）
- `originalPrice`: 原价（BigDecimal类型，所有时间段价格的总和）
- `actualPrice`: 实付价格（BigDecimal类型）
- `discountAmount`: 优惠金额（BigDecimal类型）
- `paymentMethod`: 支付方式（1：微信，2：支付宝，3：银行卡）
- `paymentStatus`: 支付状态（0：未支付，1：已支付，2：已退款）
- `orderStatus`: 订单状态（0：待支付，1：已支付，2：进行中，3：已完成，4：已取消）
- `orderAddress`: 订单地址（下单时的地址，优先使用请求中的地址，否则使用第一个时间段的地址，String类型）
- `orderArea`: 订单商圈（下单时的商圈，优先使用请求中的商圈，否则使用第一个时间段的商圈，String类型）
- `orderLongitude`: 订单地址经度（下单时的经度，优先使用请求中的经度，否则使用第一个时间段的经度，Double类型）
- `orderLatitude`: 订单地址纬度（下单时的纬度，优先使用请求中的纬度，否则使用第一个时间段的纬度，Double类型）
- `contactPhone`: 联系电话（用户联系电话，String类型）
- `remark`: 备注（String类型）
- `schedules`: 预约时间段列表（数组，必含字段）
  - `scheduleId`: 预约时间段ID（Long类型）
  - `scheduleDate`: 预约日期（格式：YYYY-MM-DD）
  - `startTime`: 开始时间（格式：HH:mm:ss）
  - `endTime`: 结束时间（格式：HH:mm:ss）
  - `price`: 该时间段价格（BigDecimal类型）
  - `address`: 该时间段地址（String类型，优先使用请求中的地址，否则使用schedule中的地址）
  - `area`: 该时间段商圈（String类型，优先使用请求中的商圈，否则使用schedule中的商圈）
  - `longitude`: 该时间段经度（Double类型，优先使用请求中的经度，否则使用schedule中的经度）
  - `latitude`: 该时间段纬度（Double类型，优先使用请求中的纬度，否则使用schedule中的纬度）

#### 注意事项
1. **支持多个时间段**：
   - 一个订单可以包含多个预约时间段（`scheduleIds` 数组）
   - 所有时间段必须属于同一个教练
   - 系统会验证所有时间段的状态和是否满员

2. **时间段锁定机制**：
   - 用户创建订单后，对应的时间段会被**立即锁定**（`status` 设为 0：不可预约，`order_id` 设置为订单ID）
   - 锁定后，该时间段不能再被其他订单预约
   - 如果订单取消，时间段会恢复为可预约状态（`status` 设为 1：可预约，`order_id` 清空）
   - **重要**：一个时间段在同一时间只能被一个订单锁定

3. **用户和教练信息自动填充**：
   - 系统会自动查询用户信息，填充 `userName` 字段
   - 系统会自动查询教练信息，填充 `coachName` 和 `coachPhone` 字段
   - 这些信息在订单创建时保存，即使后续用户或教练信息变更，订单中的信息保持不变

4. **地址字段优先级**：
   - 如果请求中提供了 `address`、`area`、`longitude`、`latitude`，会更新到对应的时间段中
   - 如果请求中未提供，则使用时间段原有的地址信息
   - 订单地址信息在创建时保存，不会随 schedule 的地址变更而变更

5. **价格计算**：
   - `originalPrice`：所有时间段价格的总和（如果时间段有价格），否则使用 `paymentAmount`
   - `actualPrice`：使用请求中的 `paymentAmount`
   - `discountAmount`：`originalPrice - actualPrice`

6. **预约时间段验证**：
   - 系统会验证所有预约时间段是否存在
   - 系统会验证所有预约时间段状态是否为可预约（status = 1）
   - 系统会检查所有预约时间段是否已满员
   - 系统会验证所有时间段是否属于同一个教练
   - 系统会检查时间段是否已被其他订单锁定（`order_id` 不为空）

### 11.2 查询订单详情

#### 接口地址
```
POST /order/detail
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（必须）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "orderId": 1,
  "userId": "用户ID（必填，String类型，用于权限验证）"
}
```

#### 字段说明
- `orderId`: 订单ID（必填，Long类型）
- `userId`: 用户ID（必填，String类型，用于权限验证）

#### 响应示例
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNo": "ORD1234567890",
    "userId": "用户ID（String类型，业务标识符）",
    "userName": "张三",
    "coachId": "教练ID（String类型，业务标识符）",
    "coachName": "李教练",
    "coachPhone": "13800138000",
    "courseName": "预约课程",
    "courseType": 1,
    "originalPrice": 500.00,
    "actualPrice": 500.00,
    "discountAmount": 0.00,
    "paymentMethod": 1,
    "paymentStatus": 0,
    "orderStatus": 0,
    "orderAddress": "上海市浦东新区陆家嘴环路1000号",
    "orderArea": "陆家嘴",
    "orderLongitude": 121.473701,
    "orderLatitude": 31.230416,
    "contactPhone": "13800138000",
    "remark": "备注",
    "schedules": [
      {
        "scheduleId": 1,
        "scheduleDate": "2025-01-20",
        "startTime": "09:00:00",
        "endTime": "10:00:00",
        "price": 200.00,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "area": "陆家嘴",
        "longitude": 121.473701,
        "latitude": 31.230416
      },
      {
        "scheduleId": 2,
        "scheduleDate": "2025-01-21",
        "startTime": "14:00:00",
        "endTime": "15:30:00",
        "price": 150.00,
        "address": "上海市浦东新区陆家嘴环路1000号",
        "area": "陆家嘴",
        "longitude": 121.473701,
        "latitude": 31.230416
      }
    ]
  }
}
```

#### 响应字段说明
响应字段与创建订单接口（11.1）的响应字段完全一致，包含 `schedules` 数组，详见 11.1 节的响应字段说明。

#### 注意事项
- 只能查看自己的订单（通过 `userId` 进行权限验证）
- 如果订单不存在或无权查看，会返回相应的错误信息

### 11.3 查询用户订单列表

#### 接口地址
```
POST /order/list
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（必须）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "userId": "用户ID（必填，String类型）",
  "orderStatus": 0,
  "pageNum": 1,
  "pageSize": 10
}
```

#### 字段说明
- `userId`: 用户ID（必填，String类型）
- `orderStatus`: 订单状态（可选，0：待支付，1：已支付，2：进行中，3：已完成，4：已取消）
- `pageNum`: 页码（可选，默认1）
- `pageSize`: 每页大小（可选，默认10）

#### 响应示例
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNo": "ORD1234567890",
      "userId": "用户ID（String类型，业务标识符）",
      "userName": "张三",
      "coachId": "教练ID（String类型，业务标识符）",
      "coachName": "李教练",
      "coachPhone": "13800138000",
      "courseName": "预约课程",
      "courseType": 1,
      "originalPrice": 500.00,
      "actualPrice": 500.00,
      "discountAmount": 0.00,
      "paymentMethod": 1,
      "paymentStatus": 0,
      "orderStatus": 0,
      "orderAddress": "上海市浦东新区陆家嘴环路1000号",
      "orderArea": "陆家嘴",
      "orderLongitude": 121.473701,
      "orderLatitude": 31.230416,
      "contactPhone": "13800138000",
      "remark": "备注",
      "schedules": [
        {
          "scheduleId": 1,
          "scheduleDate": "2025-01-20",
          "startTime": "09:00:00",
          "endTime": "10:00:00",
          "price": 200.00,
          "address": "上海市浦东新区陆家嘴环路1000号",
          "area": "陆家嘴",
          "longitude": 121.473701,
          "latitude": 31.230416
        },
        {
          "scheduleId": 2,
          "scheduleDate": "2025-01-21",
          "startTime": "14:00:00",
          "endTime": "15:30:00",
          "price": 150.00,
          "address": "上海市浦东新区陆家嘴环路1000号",
          "area": "陆家嘴",
          "longitude": 121.473701,
          "latitude": 31.230416
        }
      ]
    },
    {
      "id": 2,
      "orderNo": "ORD1234567891",
      "userId": "用户ID（String类型，业务标识符）",
      "userName": "张三",
      "coachId": "教练ID（String类型，业务标识符）",
      "coachName": "王教练",
      "coachPhone": "13800138001",
      "courseName": "预约课程",
      "courseType": 1,
      "originalPrice": 180.00,
      "actualPrice": 180.00,
      "discountAmount": 0.00,
      "paymentMethod": 1,
      "paymentStatus": 1,
      "orderStatus": 2,
      "orderAddress": "上海市徐汇区漕溪北路羽毛球馆",
      "orderArea": "徐汇区",
      "orderLongitude": 121.437759,
      "orderLatitude": 31.188315,
      "contactPhone": "13800138000",
      "remark": "希望教练能多关注技术细节",
      "schedules": [
        {
          "scheduleId": 10,
          "scheduleDate": "2025-01-21",
          "startTime": "10:00:00",
          "endTime": "11:30:00",
          "price": 180.00,
          "address": "上海市徐汇区漕溪北路羽毛球馆",
          "area": "徐汇区",
          "longitude": 121.437759,
          "latitude": 31.188315
        }
      ]
    }
  ],
  "total": 2
}
```

#### 响应字段说明

**顶层字段：**
- `data`: 订单列表（数组）
- `total`: 订单总数（Long类型，用于分页）

**订单列表项字段（每个订单对象包含以下字段）：**
- `id`: 订单ID（Long类型，自增主键）
- `orderNo`: 订单号（String类型，唯一）
- `userId`: 用户ID（String类型，业务标识符）
- `userName`: 用户名（下单时的用户名，String类型）
- `coachId`: 教练ID（String类型，业务标识符）
- `coachName`: 教练姓名（下单时的教练姓名，String类型）**必含字段**
- `courseName`: 课程名称（默认"预约课程"）
- `courseType`: 课程类型（1：一对一，2：小班课，3：大班课，4：在线课程）
- `originalPrice`: 原价（BigDecimal类型，所有时间段价格的总和）
- `actualPrice`: 实付价格（BigDecimal类型）**必含字段**
- `discountAmount`: 优惠金额（BigDecimal类型）
- `paymentMethod`: 支付方式（1：微信，2：支付宝，3：银行卡）
- `paymentStatus`: 支付状态（0：未支付，1：已支付，2：已退款）
- `orderStatus`: 订单状态（0：待支付，1：已支付，2：进行中，3：已完成，4：已取消）
- `orderAddress`: 订单地址（下单时的地址，String类型）**必含字段**
- `orderArea`: 订单商圈（下单时的商圈，String类型）
- `orderLongitude`: 订单地址经度（下单时的经度，Double类型）
- `orderLatitude`: 订单地址纬度（下单时的纬度，Double类型）
- `coachPhone`: 教练联系电话（下单时的教练联系电话，String类型）
- `contactPhone`: 联系电话（用户联系电话，String类型）
- `remark`: 备注（String类型）
- `schedules`: 预约时间段列表（数组，必含字段）**必含字段（预订时间）**
  - `scheduleId`: 预约时间段ID（Long类型）
  - `scheduleDate`: 预约日期（格式：YYYY-MM-DD）**必含字段（预订时间）**
  - `startTime`: 开始时间（格式：HH:mm:ss）**必含字段（预订时间）**
  - `endTime`: 结束时间（格式：HH:mm:ss）**必含字段（预订时间）**
  - `price`: 该时间段价格（BigDecimal类型）
  - `address`: 该时间段地址（String类型）**必含字段**
  - `area`: 该时间段商圈（String类型）
  - `longitude`: 该时间段经度（Double类型）
  - `latitude`: 该时间段纬度（Double类型）

#### 注意事项
- 订单列表按创建时间倒序排列（最新的订单在前）
- 支持按订单状态筛选（`orderStatus` 参数）
- 支持分页查询（`pageNum` 和 `pageSize` 参数）
- 每个订单项都包含完整的预订时间（`schedules` 数组中的 `scheduleDate`、`startTime`、`endTime`）、教练名字（`coachName`）、订单价格（`actualPrice`、`originalPrice`）和地址信息（`orderAddress`、`orderArea`、`orderLongitude`、`orderLatitude`）
- 每个订单的 `schedules` 数组包含该订单的所有预约时间段，按日期和时间升序排列

### 11.4 更新订单支付状态

#### 接口地址
```
POST /order/updatePaymentStatus
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（必须）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "orderNo": "ORD1234567890",
  "paymentStatus": 1
}
```

#### 字段说明
- `orderNo`: 订单号（必填，String类型）
- `paymentStatus`: 支付状态（必填，0：未支付，1：已支付，2：已退款）

### 11.5 取消订单

#### 接口地址
```
POST /order/cancel
```

#### 请求方式
Content-Type: `application/json`

#### 请求头
```
authorization: token字符串（必须）
```

#### 请求体
```json
{
  "head": {
    "userLongitude": 121.473701,
    "userLatitude": 31.230416
  },
  "orderId": 1,
  "userId": "用户ID（必填，String类型，用于权限验证）"
}
```

#### 字段说明
- `orderId`: 订单ID（必填，Long类型）
- `userId`: 用户ID（必填，String类型，用于权限验证）

#### 订单状态说明
- `orderStatus`: 订单状态（0：待支付，1：已支付，2：进行中，3：已完成，4：已取消）
- `paymentStatus`: 支付状态（0：未支付，1：已支付，2：已退款）

---

## 12. 获取用户完整信息（包含教练信息）

### 接口地址
```
GET /user/info
```

### 请求头
```
authorization: token字符串（必须）
```

### 请求示例
```bash
GET /user/info
Headers:
  authorization: your_token_here
```

### 响应示例

#### 用户是教练
```json
{
  "success": true,
  "data": {
    "userInfo": {
      "userId": "用户ID（String类型）",
      "username": "用户名",
      "avatar": "头像URL",
      "phone": "手机号",
      "email": "邮箱",
      "gender": 0,
      "cityId": 1,
      "cityName": "上海",
      "coachId": "教练ID（String类型）"
    },
    "coachInfo": {
      "coachId": "教练ID（String类型，业务标识符）",
      "coachName": "教练姓名",
      "avatar": "头像URL",
      "introduction": "个人介绍",
      "experienceYears": 5,
      "sportTypes": ["篮球", "健身"],
      "teachingAreas": ["浦东新区", "黄浦区"],
      "hourlyRate": 200.00,
      "rating": 4.8,
      "totalReviews": 100,
      "totalStudents": 50,
      "cityName": "上海",
      "coachArea": "陆家嘴",
      "coachAddress": "详细地址",
      "height": 175.00,
      "weight": 70.00,
      "coachLongitude": 121.473701,
      "coachLatitude": 31.230416
    },
    "isCoach": true,
    "orderCount": 15
  }
}
```

#### 用户不是教练
```json
{
  "success": true,
  "data": {
    "userInfo": {
      "userId": "用户ID（String类型）",
      "username": "用户名",
      "avatar": "头像URL",
      "phone": "手机号",
      "email": "邮箱",
      "gender": 0,
      "cityId": 1,
      "cityName": "上海",
      "coachId": null
    },
    "coachInfo": null,
    "isCoach": false,
    "orderCount": 8
}
```

### 响应字段说明

**顶层字段：**
- `userInfo`: 用户信息对象
  - `userId`: 用户ID（String类型，业务标识符）
  - `username`: 用户名
  - `avatar`: 头像URL
  - `phone`: 手机号
  - `email`: 邮箱
  - `gender`: 性别（0：男，1：女）
  - `cityId`: 城市ID
  - `cityName`: 城市名称
  - `coachId`: 教练ID（String类型，业务标识符，如果用户注册为教练则有值，否则为null）
- `coachInfo`: 教练信息对象（如果用户是教练则有值，否则为null）
  - `coachId`: 教练ID（String类型，业务标识符）
  - `coachName`: 教练姓名
  - `avatar`: 头像URL
  - `introduction`: 个人介绍
  - `experienceYears`: 教学经验年数
  - `sportTypes`: 运动类型列表（String数组）
  - `teachingAreas`: 教学区域列表（String数组）
  - `hourlyRate`: 每小时收费标准（BigDecimal类型）
  - `rating`: 综合评分（0-5分）
  - `totalReviews`: 总评价数
  - `totalStudents`: 总学员数
  - `cityName`: 城市名称
  - `coachArea`: 教练区域
  - `coachAddress`: 教练地址
  - `height`: 身高（厘米，BigDecimal类型）
  - `weight`: 体重（公斤，BigDecimal类型）
  - `coachLongitude`: 教练经度
  - `coachLatitude`: 教练纬度
- `isCoach`: 是否有教练身份（Boolean类型，true：是教练，false：不是教练）
- `orderCount`: 订单数量（Long类型，该用户的所有订单总数）

### 注意事项
- 如果用户是教练，`coachInfo` 字段会有值，`isCoach` 为 `true`
- 如果用户不是教练，`coachInfo` 字段为 `null`，`isCoach` 为 `false`
- `orderCount` 字段统计该用户的所有订单数量（不区分订单状态）

---

## 13. 获取所有筛选维度（getAllFilterTypes）

### 接口地址
```
POST /domain/getAllFilterTypes
```

### 请求方式
Content-Type: `application/json`

### 请求体
无需请求体（可不传 body，或传空对象 `{}`）。

### 响应示例
```json
{
  "success": true,
  "data": {
    "domains": [
      {
        "domainId": "1",
        "domainName": "球类运动",
        "sportTypes": [
          { "id": 1, "name": "羽毛球", "icon": "https://example.com/icon1.png", "sort": 1 },
          { "id": 2, "name": "乒乓球", "icon": "https://example.com/icon2.png", "sort": 2 }
        ]
      },
      {
        "domainId": "4",
        "domainName": "瑜伽",
        "sportTypes": [
          { "id": 23, "name": "哈他瑜伽", "icon": "https://example.com/icon23.png", "sort": 1 }
        ]
      }
    ],
    "cities": [
      { "cityId": 0, "cityName": "全国" },
      { "cityId": 1, "cityName": "上海" },
      { "cityId": 2, "cityName": "北京" }
    ],
    "areas": [
      { "areaId": 1, "cityId": 1, "areaName": "陆家嘴" },
      { "areaId": 2, "cityId": 1, "areaName": "浦东新区" }
    ]
  }
}
```

### 响应字段说明

**顶层字段：**
- `domains`: 大领域列表（数组），按 domainId、sort 排序
- `cities`: 城市列表（数组），来自 **qdd_city** 表，首项为「全国」（`cityId: 0`），其余按 sort、城市名称排序；用于筛选时，选「全国」则教练列表返回所有城市教练
- `areas`: 地区/商圈列表（数组），来自 **qdd_area** 表，按 city_id、sort、地区名称排序，用于筛选等

**domains 中每个元素（DomainInfo）：**
- `domainId`: 大领域ID（String 类型）
- `domainName`: 大领域名称（String 类型）
- `sportTypes`: 该领域下的运动类型列表（数组）

**sportTypes 中每个元素（SportTypeInfo）：**
- `id`: 运动类型ID（Long 类型）
- `name`: 运动类型名称（String 类型）
- `icon`: 图标 URL（String 类型，可为 null）
- `sort`: 排序值（Integer 类型，用于前端展示顺序）

**cities 中每个元素（CityInfo）：**
- `cityId`: 城市ID（Integer 类型）；**0 表示全国**，选全国时教练列表接口不按城市筛选；≥1 为具体城市（qdd_city.id）
- `cityName`: 城市名称（String 类型）

**areas 中每个元素（AreaInfo）：**
- `areaId`: 地区/商圈ID（Long 类型，关联 qdd_area.id）
- `cityId`: 所属城市ID（Integer 类型，关联 qdd_city.id）
- `areaName`: 地区/商圈名称（String 类型）

### 注意事项
- 无需登录即可调用
- 城市、地区数据来自 **qdd_city**、**qdd_area** 表；`domains` 按 `domainId`、运动类型 `sort` 升序；`cities` 首项为全国（cityId=0），其余按 sort、城市名称升序；`areas` 按 city_id、sort、地区名称升序
- 教练列表/教练注册等接口中的 `domainId`、`sportTypeId` 与本接口返回的 `domainId`、`sportTypes[].id` 对应；`cityId` 对应 `cities[].cityId`；`areaId` 对应 `areas[].areaId`
- `cities`、`areas` 可用于教练列表筛选：调用 `/coach/queryByAll` 时传 `cityId`（0 或 -1 为全国，返回所有城市教练）、`areaId` 或 `area` 等

---

## 14. 概览数据（看所有数据）

### 接口地址
```
POST /statistics/overview
```

### 请求方式
Content-Type: `application/json`

### 请求体
无需请求体（可不传 body，或传空对象 `{}`）。

### 响应示例
```json
{
  "success": true,
  "data": {
    "totalUserCount": 100,
    "totalCoachCount": 20,
    "monthlyStats": [
      { "month": "2025-01", "orderCount": 15, "revenue": 3200.00 },
      { "month": "2025-02", "orderCount": 22, "revenue": 4800.50 }
    ],
    "totalOrderCount": 150,
    "totalRevenue": 35000.00,
    "orderStatsBySportType": [
      { "sportTypeId": 1, "sportTypeName": "羽毛球", "orderCount": 45, "revenue": 9000.00 },
      { "sportTypeId": 2, "sportTypeName": "网球", "orderCount": 38, "revenue": 7600.00 }
    ]
  }
}
```

### 响应字段说明
- `totalUserCount`: 总用户数（qdd_user 表）
- `totalCoachCount`: 总教练数（qdd_coach 表）
- `monthlyStats`: 按月统计（仅统计已支付订单）
  - `month`: 月份，格式 yyyy-MM
  - `orderCount`: 该月订单数
  - `revenue`: 该月收益（元）
- `totalOrderCount`: 总订单数（已支付）
- `totalRevenue`: 总收益（元，已支付订单实付金额合计）
- `orderStatsBySportType`: 按运动类型统计（订单关联教练的主运动类型，仅已支付订单）
  - `sportTypeId`: 运动类型ID（qdd_sport_info.id）
  - `sportTypeName`: 运动类型名称
  - `orderCount`: 该运动类型订单数
  - `revenue`: 该运动类型收益（元）

### 注意事项
- 无需登录即可调用
- 订单与收益仅统计支付状态为已支付（payment_status=1）的订单
- 运动类型取订单关联教练的 `sport_type_ids` 中第一个 ID；无教练或无运动类型时归为「未知」