# 教练管理后台系统

基于 React 18 + TypeScript + Vite + Ant Design 的教练管理后台系统。

## 技术栈

- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Zustand
- **UI 组件**: Ant Design 5
- **路由**: React Router v6
- **样式**: CSS Modules + Sass
- **数据可视化**: Recharts
- **HTTP 客户端**: Axios
- **日期处理**: Day.js

## 功能模块

### 1. 数据看板
- 统计数据展示（用户、教练、订单、营收）
- 订单趋势图表
- 运动类型分布
- 月度营收统计

### 2. 教练管理
- 教练列表（支持多维度筛选）
- 教练详情查看
- 教练信息编辑

### 3. 预约管理
- 预约时间设置
- 时间状态管理
- 批量操作支持

### 4. 订单管理
- 订单列表查询
- 订单详情查看
- 订单状态筛选
- 订单取消操作

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── api/              # API 接口层
├── assets/           # 静态资源
├── components/       # 通用组件
│   └── common/       # 公共组件
├── layouts/          # 布局组件
├── pages/            # 页面组件
│   ├── auth/         # 认证相关页面
│   ├── dashboard/    # 数据看板
│   ├── coach/        # 教练管理
│   ├── schedule/     # 预约管理
│   └── order/        # 订单管理
├── router/           # 路由配置
├── stores/           # 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── App.tsx           # 根组件
└── main.tsx          # 应用入口
```

## API 接口

后端接口文档请参考 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 基础配置

- 开发环境代理配置在 `vite.config.ts`
- API 基础路径通过环境变量配置
- Token 存储在 localStorage

### 请求拦截

- 自动添加 Authorization 头
- 统一错误处理
- 自动刷新 Token

## 状态管理

使用 Zustand 进行全局状态管理：

- **userStore**: 用户信息、登录状态
- **appStore**: 应用全局状态（加载、侧边栏等）

## 样式方案

- CSS Modules 实现组件样式隔离
- Sass 预处理器
- 全局样式变量定义

## 开发规范

### 命名规范

- 文件名：PascalCase（组件）、camelCase（工具函数）
- 组件名：PascalCase
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE

### 代码风格

- 使用 ESLint 进行代码检查
- 遵循 Airbnb 规范
- 组件使用函数式组件 + Hooks

## 浏览器支持

- Chrome（推荐）
- Firefox
- Safari
- Edge

## License

MIT
