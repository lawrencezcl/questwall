# Quest Wall Telegram MiniApp

这是 Quest Wall 的前端应用程序，基于 React 和 Vite 构建的 Telegram MiniApp。

## 功能特性

- Telegram WebApp SDK 集成
- TonConnect 钱包集成
- 任务列表和交互
- 奖励展示
- 响应式 UI 设计

## 技术栈

- React 18
- Vite
- Telegram WebApp SDK
- TonConnect UI
- JavaScript/JSX

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

这将启动开发服务器，地址为 `http://localhost:5173`。

### 构建

```bash
npm run build
```

这将在 `dist/` 目录中创建生产构建。

### 预览

```bash
npm run preview
```

这将在本地预览生产构建。

## 项目结构

```
src/
├── components/         # React 组件
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
├── utils/              # 工具函数
├── assets/             # 静态资源
└── main.jsx            # 入口文件
```

## 环境变量

在根目录创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 测试

```bash
npm run test
```

## 部署

前端可以部署到任何静态托管服务。对于 Telegram MiniApp 部署，请遵循 Telegram 的 MiniApp 托管指南。

## 贡献

1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 许可证

MIT