# Quest Wall 后端项目

Quest Wall 是一个基于 Telegram MiniApp 的任务墙系统，支持多种任务类型和奖励发放机制。

## 技术栈

- Node.js (NestJS)
- PostgreSQL
- Redis
- ClickHouse

## 项目结构

```
questwall-backend/
├── src/
│   ├── auth/          # 鉴权模块
│   ├── quests/        # 任务模块
│   ├── rewards/       # 奖励模块
│   ├── wallet/        # 钱包模块
│   ├── ads/           # 广告模块
│   ├── risk/          # 风控模块
│   ├── billing/       # 计费模块
│   ├── database/      # 数据库模块
│   ├── app.module.ts  # 根模块
│   └── main.ts        # 入口文件
├── test/
├── package.json
└── README.md
```

## 开发环境

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run start:dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

## 环境变量

创建 `.env` 文件：

```env
DATABASE_URL=postgresql://questwall:questwall123@localhost:5432/questwall
REDIS_URL=redis://localhost:6379
CLICKHOUSE_URL=http://localhost:8123
JWT_SECRET=your-super-secret-jwt-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TONCONNECT_MANIFEST_URL=https://your-domain.com/tonconnect-manifest.json
```

## API 文档

API 遵循 RESTful 设计原则。关键端点包括：

- `POST /auth/telegram` - Telegram 鉴权
- `POST /auth/refresh` - 刷新 JWT 令牌
- `GET /quests` - 获取任务列表
- `POST /quests` - 创建新任务
- `GET /quests/:id` - 获取任务详情
- `POST /quests/:id/claim` - 领取任务
- `POST /quests/:id/submit` - 提交任务证明
- `POST /quests/:id/reward` - 发放奖励
- `GET /rewards` - 获取用户奖励
- `POST /rewards/withdraw` - 提现奖励
- `GET /payouts/:id` - 获取提现状态
- `POST /wallet/connect/start` - 启动钱包连接
- `POST /wallet/tx/prepare` - 准备交易
- `POST /wallet/tx/confirm` - 确认交易
- `GET /wallet/tx/:id` - 获取交易状态
- `POST /ads/callback/adsgram` - Adsgram 回调
- `GET /billing/report` - 获取计费报告
- `POST /risk/fp` - 提交设备指纹
- `GET /risk/score` - 获取风险评分

## 数据库设计

### PostgreSQL (事务数据库)

1. **users** - 用户信息
2. **quests** - 任务信息
3. **actions** - 用户任务行为
4. **rewards** - 奖励记录
5. **payouts** - 提现记录

### ClickHouse (分析数据库)

1. **events** - 用户事件
2. **ad_impressions** - 广告展示
3. **anti_fraud** - 反作弊记录

## 测试

```bash
# 运行单元测试
npm run test

# 以监听模式运行单元测试
npm run test:watch

# 运行集成测试
npm run test:e2e

# 运行带覆盖率的测试
npm run test:cov
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