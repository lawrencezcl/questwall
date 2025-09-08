# Quest Wall 项目文档

## 1. 项目概述

Quest Wall 是一个基于 Telegram MiniApp 的任务墙系统，允许用户完成各种任务并获得奖励。系统支持多种任务类型，包括社交任务（关注频道、加入群组）、链上任务（代币转账、NFT 铸造）等。

## 2. 功能特性

### 核心功能
- **Telegram 鉴权**: 使用 Telegram WebApp initData 进行安全鉴权
- **任务系统**: 支持多种任务类型和奖励机制
- **钱包集成**: 通过 TonConnect 集成多种 TON 钱包
- **奖励发放**: 支持 Stars、Jetton 和 NFT 奖励
- **广告集成**: 集成 Adsgram 广告网络
- **风控系统**: 多层次风险控制和反作弊机制
- **数据分析**: 实时监控和数据分析面板

### 技术特性
- **前后端分离**: React 前端 + NestJS 后端
- **区块链集成**: TON 区块链智能合约
- **微服务架构**: 模块化设计，易于扩展
- **容器化部署**: Docker + Kubernetes 支持
- **CI/CD**: GitHub Actions 自动化流程

## 3. 技术栈

### 前端
- React 18
- Telegram WebApp SDK
- TonConnect UI
- Vite 构建工具

### 后端
- NestJS (Node.js)
- PostgreSQL (主数据库)
- Redis (缓存)
- ClickHouse (数据分析)
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

## 4. 快速开始

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

### 环境变量配置

创建 `.env` 文件在后端项目根目录：

```env
# 数据库配置
DATABASE_URL=postgresql://questwall:questwall123@localhost:5432/questwall

# Redis 配置
REDIS_URL=redis://localhost:6379

# JWT 密钥
JWT_SECRET=your-super-secret-jwt-key

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# TonConnect 配置
TONCONNECT_MANIFEST_URL=https://your-domain.com/tonconnect-manifest.json
```

## 5. API 文档

### 鉴权接口

#### POST /auth/telegram
使用 Telegram initData 换取 JWT

**请求**
```json
{
  "initData": "user=%7B%22id%22%3A123456789%7D&hash=..."
}
```

**响应**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "tg_id": 123456789,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "locale": "en"
  }
}
```

#### POST /auth/refresh
刷新 JWT

**响应**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### 任务接口

#### GET /quests
获取任务列表

**查询参数**
- `page`: 页码 (默认: 1)
- `pageSize`: 每页数量 (默认: 20)

**响应**
```json
{
  "items": [
    {
      "id": 1,
      "type": "join_channel",
      "title": "关注频道 @your_channel",
      "reward": {
        "type": "stars",
        "amount": "5"
      },
      "limits": {
        "dailyCap": 100,
        "perUserCap": 1
      },
      "status": "active"
    }
  ],
  "total": 1
}
```

#### POST /quests
创建任务（广告主权限）

**请求**
```json
{
  "type": "join_channel",
  "title": "关注频道 @your_channel",
  "reward": {
    "type": "stars",
    "amount": "5"
  },
  "limits": {
    "dailyCap": 100,
    "perUserCap": 1
  }
}
```

#### POST /quests/:id/claim
领取任务

#### POST /quests/:id/submit
提交任务证明

#### POST /quests/:id/reward
发放奖励（管理接口）

### 钱包接口

#### POST /wallet/connect/start
启动钱包连接

#### POST /wallet/tx/prepare
准备交易

#### POST /wallet/tx/confirm
确认交易

#### GET /wallet/tx/:id
查询交易状态

## 6. 数据库设计

详细数据库设计请参考 [数据库设计文档](questwall-db-design.md)

## 7. 合约设计

详细合约设计请参考 [合约设计文档](questwall-contract-design.md)

## 8. 部署指南

详细部署指南请参考 [部署文档](questwall-deployment.md)

## 9. 测试策略

详细测试策略请参考 [测试文档](questwall-testing.md)

## 10. 风控策略

### 频控限速
- 每用户每分钟最多完成 10 个任务
- 每设备每小时最多完成 50 个任务
- 每 IP 每天最多完成 200 个任务

### 设备指纹
- 收集用户代理、屏幕参数、存储指纹
- 相同指纹多账号风险评分提升

### 行为相似度
- 分析用户行为轨迹
- 短时集中相同行为打分下降

### 地理位置
- 基于 IP 库打标签
- 异常地理位置切换风险提升

### 链上校验
- 校验真实签名地址
- 验证最小金额要求

### 灰度发奖
- 低风险即时发放
- 高风险延迟复核

### 黑名单
- 账号级别封禁
- 设备级别封禁
- 钱包地址级别封禁

## 11. 监控指标

### 核心产品指标
- 任务完成率（分类型）
- 每有效任务成本（eCPT）
- 次留/7 留/30 留
- 打开→领取→完成漏斗

### 风控与质量
- 反作弊命中率、误杀率
- 高风险用户占比
- 广告真实转化率

### 技术与稳定性
- TMA 秒开率（<1.5s）
- API p95（<200ms）
- 钱包连接成功率
- 链上确认延迟中位数

## 12. 故障排除

### 常见问题

#### 1. Telegram 鉴权失败
- 检查 TELEGRAM_BOT_TOKEN 环境变量
- 验证 initData 的 hash 值
- 确认服务器时间同步

#### 2. 钱包连接失败
- 检查 TONCONNECT_MANIFEST_URL 配置
- 验证 manifest 文件格式
- 确认钱包应用版本

#### 3. 任务奖励未到账
- 检查奖励服务日志
- 验证区块链交易状态
- 确认用户钱包地址正确

### 日志查看

```bash
# 查看后端服务日志
docker-compose logs backend

# 查看数据库日志
docker-compose logs postgres

# 查看前端构建日志
cd questwall-tma && npm run build --verbose
```

## 13. 贡献指南

### 代码规范
- 遵循 TypeScript/JavaScript 标准规范
- 使用 ESLint 和 Prettier 进行代码格式化
- 编写单元测试和集成测试
- 提交前运行 lint 和 test 脚本

### 提交流程
1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 代码审查
- 所有 PR 需要至少一个团队成员审查
- 确保测试覆盖率达标
- 验证功能完整性和安全性
- 检查代码质量和性能影响

## 14. 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 15. 联系方式

如有问题或建议，请通过以下方式联系我们：
- 提交 GitHub Issue
- 发送邮件至 support@questwall.com
- 在 Telegram 群组中提问