# Quest Wall 数据库设计

## 1. 事务库（PostgreSQL）

### users 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | bigserial | 主键 |
| tg_id | bigint | Telegram 用户 ID |
| wallet_addr | text | 钱包地址 |
| locale | text | 语言 |
| risk_score | int | 风险评分 |
| created_at | timestamptz | 创建时间 |

### quests 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | bigserial | 主键 |
| owner_id | bigint | 所有者 ID |
| type | text | 任务类型 |
| reward_type | text | 奖励类型 |
| reward_amount | numeric | 奖励数量 |
| reward_asset | text | 奖励资产地址 |
| limits | jsonb | 限制条件 |
| status | text | 状态 |
| created_at | timestamptz | 创建时间 |

### actions 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | bigserial | 主键 |
| user_id | bigint | 用户 ID |
| quest_id | bigint | 任务 ID |
| proof | jsonb | 证明数据 |
| risk_score | int | 风险评分 |
| status | text | 状态 |
| created_at | timestamptz | 创建时间 |

### rewards 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | bigserial | 主键 |
| user_id | bigint | 用户 ID |
| quest_id | bigint | 任务 ID |
| type | text | 奖励类型 |
| amount | numeric | 奖励数量 |
| asset | text | 资产地址 |
| tx_hash | text | 交易哈希 |
| stars_tx_id | text | Stars 交易 ID |
| created_at | timestamptz | 创建时间 |

### payouts 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| id | bigserial | 主键 |
| beneficiary_id | bigint | 受益人 ID |
| asset | text | 资产类型 |
| amount | numeric | 数量 |
| status | text | 状态 |
| tx_hash | text | 交易哈希 |
| created_at | timestamptz | 创建时间 |

## 2. 明细与埋点（ClickHouse）

### events 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| ts | DateTime | 时间戳 |
| user_id | UInt64 | 用户 ID |
| event | String | 事件类型 |
| quest_id | UInt64 | 任务 ID |
| ctx | String | 上下文数据（JSON） |

### ad_impressions 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| ts | DateTime | 时间戳 |
| slot | String | 广告位 |
| cpm | Float64 | 千次展示成本 |
| campaign_id | String | 广告活动 ID |
| user_id | UInt64 | 用户 ID |

### anti_fraud 表

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| ts | DateTime | 时间戳 |
| user_id | UInt64 | 用户 ID |
| fp_hash | String | 指纹哈希 |
| score | UInt32 | 风险评分 |
| rule_ids | Array(String) | 触发的规则 ID |