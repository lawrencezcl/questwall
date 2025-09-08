# Quest Wall · Telegram MiniApp Skeleton

本仓库为 **Quest Wall** 的最小可运行前端骨架：演示 Telegram WebApp 集成、任务列表占位、后端 API 占位。

## 使用

```bash
npm i
npm run dev
# 在 Telegram WebApp 环境中打开，或用浏览器本地调试（initData 将为空）
```

## 下一步
- 引入 TonConnect UI（React 组件）对接 Telegram Wallet / Tonkeeper
- 调用后端 OpenAPI（见附件：`questwall_openapi_20250906-103009.yaml`）
- 接入 Stars 支付与 Ads（Adsgram）

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

## 开发

### 环境变量

创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 测试

```bash
npm run test
```

## 国际化

项目支持中英文文档：
- 英文文档: [README.md](README.md)
- 中文文档: [README_zh.md](README_zh.md)

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 许可证

MIT