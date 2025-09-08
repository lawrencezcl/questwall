# Quest Wall 后端

这是 Quest Wall 的后端服务，基于 NestJS 构建。

## 功能特性

- RESTful API
- JWT 鉴权
- PostgreSQL 数据库集成
- Redis 缓存
- ClickHouse 分析
- 模块化架构

## 技术栈

- NestJS (Node.js)
- TypeScript
- PostgreSQL
- Redis
- ClickHouse
- JWT

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- ClickHouse 23+

### 安装

```bash
npm install
```

### 开发

```bash
npm run start:dev
```

这将启动开发服务器，地址为 `http://localhost:3000`。

### 生产环境

```bash
# 构建应用程序
npm run build

# 启动生产服务器
npm run start:prod
```

## 项目结构

```
src/
├── auth/               # 鉴权模块
├── quests/             # 任务模块
├── rewards/            # 奖励模块
├── wallet/             # 钱包模块
├── ads/                # 广告模块
├── risk/               # 风控模块
├── billing/            # 计费模块
├── database/           # 数据库模块
├── app.module.ts       # 根模块
└── main.ts             # 入口文件
```

## 环境变量

在根目录创建 `.env` 文件：

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
   - id (bigserial, 主键)
   - tg_id (bigint, 唯一)
   - wallet_addr (text)
   - locale (text)
   - risk_score (int)
   - created_at (timestamptz)

2. **quests** - 任务信息
   - id (bigserial, 主键)
   - owner_id (bigint)
   - type (text)
   - reward_type (text)
   - reward_amount (numeric)
   - reward_asset (text)
   - limits (jsonb)
   - status (text)
   - created_at (timestamptz)

3. **actions** - 用户任务行为
   - id (bigserial, 主键)
   - user_id (bigint)
   - quest_id (bigint)
   - proof (jsonb)
   - risk_score (int)
   - status (text)
   - created_at (timestamptz)

4. **rewards** - 奖励记录
   - id (bigserial, 主键)
   - user_id (bigint)
   - quest_id (bigint)
   - type (text)
   - amount (numeric)
   - asset (text)
   - tx_hash (text)
   - stars_tx_id (text)
   - created_at (timestamptz)

5. **payouts** - 提现记录
   - id (bigserial, 主键)
   - beneficiary_id (bigint)
   - asset (text)
   - amount (numeric)
   - status (text)
   - tx_hash (text)
   - created_at (timestamptz)

### ClickHouse (分析数据库)

1. **events** - 用户事件
   - ts (DateTime)
   - user_id (UInt64)
   - event (String)
   - quest_id (UInt64)
   - ctx (String)

2. **ad_impressions** - 广告展示
   - ts (DateTime)
   - slot (String)
   - cpm (Float64)
   - campaign_id (String)
   - user_id (UInt64)

3. **anti_fraud** - 反作弊记录
   - ts (DateTime)
   - user_id (UInt64)
   - fp_hash (String)
   - score (UInt32)
   - rule_ids (Array(String))

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

## 部署

```bash
# 为生产环境构建
npm run build

# 启动生产服务器
npm run start:prod
```

应用程序可以使用 Docker 和 Kubernetes 部署。请参阅 `Dockerfile` 和 Kubernetes 配置获取部署配置。

## 贡献

1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 许可证

MIT