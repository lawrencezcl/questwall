# Quest Wall

Quest Wall 是一个基于 Telegram MiniApp 的任务墙系统，允许用户完成各种任务并获得奖励。系统支持多种任务类型，包括社交任务（关注频道、加入群组）、链上任务（代币转账、NFT 铸造）等。

## 功能特性

- **Telegram 鉴权**: 使用 Telegram WebApp initData 进行安全鉴权
- **任务系统**: 支持多种任务类型和奖励机制
- **钱包集成**: 通过 TonConnect 集成多种 TON 钱包
- **奖励发放**: 支持 Stars、Jetton 和 NFT 奖励
- **广告集成**: 集成 Adsgram 广告网络
- **风控系统**: 多层次风险控制和反作弊机制
- **数据分析**: 实时监控和数据分析面板

## 技术栈

### 前端
- React 18
- Telegram WebApp SDK
- TonConnect UI
- Vite 构建工具

### 后端
- NestJS (Node.js)
- PostgreSQL
- Redis
- ClickHouse
- JWT 鉴权

### 区块链
- TON 区块链
- FunC 智能合约
- TonConnect 钱包集成

### 基础设施
- Docker 容器化
- Kubernetes 编排
- GitHub Actions CI/CD
- Prometheus + Grafana 监控

## 快速开始

### 环境要求
- Node.js 18+
- Docker 和 Docker Compose
- PostgreSQL 15+
- Redis 7+
- ClickHouse 23+

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd questwall
```

2. **安装前端依赖**
```bash
cd questwall-tma
npm install
```

3. **安装后端依赖**
```bash
cd ../questwall-backend
npm install
```

4. **启动开发环境**
```bash
# 启动数据库和其他服务
cd ..
docker-compose up -d

# 启动后端服务
cd questwall-backend
npm run start:dev

# 启动前端服务
cd ../questwall-tma
npm run dev
```

## 项目结构

```
questwall/
├── questwall-tma/              # Telegram MiniApp 前端
├── questwall-backend/          # 后端服务
├── questwall-contracts/        # 智能合约
├── docker-compose.yml          # Docker 编排配置
└── README.md                   # 项目文档
```

## API 文档

API 遵循 RESTful 设计原则。关键端点包括：

- `POST /auth/telegram` - Telegram 鉴权
- `GET /quests` - 获取任务列表
- `POST /quests/:id/claim` - 领取任务
- `POST /quests/:id/submit` - 提交任务证明
- `POST /quests/:id/reward` - 发放奖励
- `POST /wallet/connect/start` - 启动钱包连接
- `POST /wallet/tx/prepare` - 准备交易
- `POST /wallet/tx/confirm` - 确认交易
- `GET /wallet/tx/:id` - 获取交易状态

## 数据库设计

### PostgreSQL (事务数据库)
- `users` - 用户信息
- `quests` - 任务信息
- `actions` - 用户任务行为
- `rewards` - 奖励记录
- `payouts` - 提现记录

### ClickHouse (分析数据库)
- `events` - 用户事件
- `ad_impressions` - 广告展示
- `anti_fraud` - 反作弊记录

## 智能合约

### Jetton 合约
- `JettonMaster.fc` - 主代币合约
- `JettonWallet.fc` - 代币钱包合约

### NFT 合约
- `NFTCollection.fc` - NFT 集合合约
- `NFTItem.fc` - 单个 NFT 合约

## 部署

项目支持使用 Docker 和 Kubernetes 进行容器化部署。本地部署请参考 `docker-compose.yml`，生产部署请参考 `k8s/` 目录中的 Kubernetes 配置。

## 测试

项目包含单元测试、集成测试和端到端测试。运行测试：

```bash
# 后端测试
cd questwall-backend
npm run test

# 前端测试
cd ../questwall-tma
npm run test
```

## 文档

完整文档可在以下文件中找到：

- [项目文档](DOCS_zh.md) - 完整项目文档
- [前端指南](questwall-tma/README_zh.md) - 前端开发指南
- [后端指南](questwall-backend/README_zh.md) - 后端开发指南
- [智能合约](questwall-contracts/README_zh.md) - 智能合约开发指南
- [API 规范](questwall-api.yaml) - 完整 API 规范

## 贡献

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系我们：
- 提交 GitHub Issue
- 发送邮件至 support@questwall.com
- 在 Telegram 群组中提问