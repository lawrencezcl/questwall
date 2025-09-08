# Quest Wall 测试策略

## 1. 前端测试

### 单元测试 (Jest)

```javascript
// src/__tests__/auth.test.js
import { verifyTelegramInitData } from '../utils/telegram';

describe('Telegram Auth', () => {
  test('should verify valid initData', () => {
    const initData = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&chat=%7B%22id%22%3A987654321%2C%22type%22%3A%22private%22%7D&chat_instance=1234567890123456789&auth_date=1678886400&hash=abcd1234efgh5678';
    
    // Mock bot token verification
    const isValid = verifyTelegramInitData(initData, 'test_bot_token');
    expect(isValid).toBe(true);
  });

  test('should reject invalid initData', () => {
    const initData = 'invalid_data';
    
    // Mock bot token verification
    const isValid = verifyTelegramInitData(initData, 'test_bot_token');
    expect(isValid).toBe(false);
  });
});
```

```javascript
// src/__tests__/quest.test.js
import { QuestService } from '../services/quest';

describe('Quest Service', () => {
  let questService;

  beforeEach(() => {
    questService = new QuestService();
  });

  test('should create a new quest', () => {
    const questData = {
      type: 'join_channel',
      title: 'Join our channel',
      reward: { type: 'stars', amount: '5' }
    };

    const quest = questService.create(questData);
    expect(quest).toHaveProperty('id');
    expect(quest.title).toBe(questData.title);
    expect(quest.status).toBe('draft');
  });

  test('should claim a quest', () => {
    const userId = 123456789;
    const questId = 1;

    const result = questService.claim(userId, questId);
    expect(result.success).toBe(true);
  });
});
```

### 集成测试 (Cypress)

```javascript
// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  it('should authenticate with Telegram initData', () => {
    cy.visit('/');
    
    // Mock Telegram WebApp
    cy.window().then((win) => {
      win.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: 'Test',
              last_name: 'User',
              username: 'testuser'
            }
          },
          ready: () => {}
        }
      };
    });

    cy.reload();
    cy.contains('你好，Test User');
  });
});
```

```javascript
// cypress/e2e/quest.cy.js
describe('Quest Flow', () => {
  beforeEach(() => {
    // Mock authentication
    cy.visit('/');
    cy.window().then((win) => {
      win.Telegram = {
        WebApp: {
          initDataUnsafe: {
            user: {
              id: 123456789,
              first_name: 'Test',
              last_name: 'User'
            }
          },
          ready: () => {}
        }
      };
    });
    cy.reload();
  });

  it('should display quest list', () => {
    cy.get('li').should('have.length.greaterThan', 0);
    cy.contains('关注频道 @your_channel');
  });

  it('should start a quest', () => {
    cy.get('button').contains('开始任务').first().click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('开始任务');
    });
  });
});
```

## 2. 后端测试

### 单元测试 (Jest)

```typescript
// src/auth/__tests__/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ tg_id: 123456789 }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('telegramAuth', () => {
    it('should generate JWT token for valid initData', async () => {
      const initData = 'user=%7B%22id%22%3A123456789%7D';
      
      const result = await service.telegramAuth(initData);
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresIn');
      expect(result).toHaveProperty('user');
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh valid token', async () => {
      const token = 'valid-token';
      
      const result = await service.refreshToken(token);
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresIn');
      expect(jwtService.verify).toHaveBeenCalled();
    });
  });
});
```

```typescript
// src/quests/__tests__/quests.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { QuestsService } from '../quests.service';

describe('QuestsService', () => {
  let service: QuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestsService],
    }).compile();

    service = module.get<QuestsService>(QuestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return quest list with pagination', () => {
      const result = service.findAll(1, 20);
      
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe('claim', () => {
    it('should claim a quest successfully', () => {
      const result = service.claim(1);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });
});
```

### 集成测试

```typescript
// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/telegram (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/telegram')
      .send({
        initData: 'user=%7B%22id%22%3A123456789%7D'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('expiresIn');
        expect(res.body).toHaveProperty('user');
      });
  });

  it('/auth/refresh (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('expiresIn');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

```typescript
// test/quests.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('QuestsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/quests (GET)', () => {
    return request(app.getHttpServer())
      .get('/quests')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('/quests/:id/claim (POST)', () => {
    return request(app.getHttpServer())
      .post('/quests/1/claim')
      .set('Authorization', 'Bearer valid-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('success');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 3. 数据库测试

### PostgreSQL 测试

```sql
-- test/migrations/001_create_test_tables.sql
CREATE TABLE IF NOT EXISTS test_users (
    id SERIAL PRIMARY KEY,
    tg_id BIGINT UNIQUE NOT NULL,
    wallet_addr TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_quests (
    id SERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    type TEXT NOT NULL,
    reward_type TEXT NOT NULL,
    reward_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

```sql
-- test/queries/user_queries_test.sql
-- Test user creation
INSERT INTO test_users (tg_id, wallet_addr) 
VALUES (123456789, 'EQD_example_wallet_address') 
RETURNING *;

-- Test user retrieval
SELECT * FROM test_users WHERE tg_id = 123456789;

-- Test user update
UPDATE test_users 
SET wallet_addr = 'EQD_new_wallet_address' 
WHERE tg_id = 123456789 
RETURNING *;
```

## 4. 合约测试

### TON Solidity 测试

```solidity
// test/JettonTest.tolk
import "../contracts/JettonMaster.tolk";
import "../contracts/JettonWallet.tolk";
import "tonlabs/tests/Tester.tolk";

contract JettonTest {
    JettonMaster master;
    address owner;

    constructor() {
        owner = get_sender();
        master = new JettonMaster(owner);
    }

    receive() {
        // 测试铸造功能
        test_mint();
        // 测试空投功能
        test_airdrop();
    }

    func test_mint() {
        // 准备测试数据
        address to_addr = address.make(0, "test_user");
        int amount = 1000000000; // 1 Jetton
        address ref = owner;

        // 调用铸造函数
        master.mint(to_addr, amount, ref);

        // 验证余额
        int balance = master.getBalance(to_addr);
        require(balance == amount, "Mint test failed");
    }

    func test_airdrop() {
        // 准备测试数据
        address[] addresses = [
            address.make(0, "user1"),
            address.make(0, "user2"),
            address.make(0, "user3")
        ];
        int[] amounts = [1000000000, 2000000000, 3000000000];

        // 调用空投函数
        master.airdrop(addresses, amounts);

        // 验证余额
        for (int i = 0; i < addresses.length(); i++) {
            int balance = master.getBalance(addresses[i]);
            require(balance == amounts[i], "Airdrop test failed for user " + i);
        }
    }
}
```

## 5. 性能测试

### API 性能测试 (Artillery)

```yaml
# test/performance/api-test.yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 20
  defaults:
    headers:
      authorization: "Bearer test-token"

scenarios:
  - name: "Get Quests"
    flow:
      - get:
          url: "/quests"
          qs:
            page: 1
            pageSize: 20

  - name: "Claim Quest"
    flow:
      - post:
          url: "/quests/1/claim"

  - name: "Get Rewards"
    flow:
      - get:
          url: "/rewards"
```

## 6. 安全测试

### 风控测试用例

```javascript
// test/security/risk-test.js
describe('Risk Control', () => {
  test('should detect duplicate fingerprint', () => {
    const fp1 = { ua: 'Mozilla/5.0...', screen: '1920x1080', storage: 'localStorage' };
    const fp2 = { ua: 'Mozilla/5.0...', screen: '1920x1080', storage: 'localStorage' };
    
    const riskScore = calculateRiskScore([fp1, fp2]);
    expect(riskScore).toBeGreaterThan(80); // 高风险
  });

  test('should detect rapid task completion', () => {
    const actions = [
      { timestamp: Date.now(), taskId: 1 },
      { timestamp: Date.now() + 100, taskId: 2 }, // 100ms 后完成另一个任务
      { timestamp: Date.now() + 200, taskId: 3 }  // 200ms 后完成第三个任务
    ];
    
    const isSuspicious = detectRapidCompletion(actions);
    expect(isSuspicious).toBe(true);
  });

  test('should detect geographic anomaly', () => {
    const locations = [
      { ip: '1.2.3.4', country: 'US', timestamp: Date.now() },
      { ip: '5.6.7.8', country: 'CN', timestamp: Date.now() + 1000 } // 1秒后在不同国家
    ];
    
    const isAnomalous = detectGeographicAnomaly(locations);
    expect(isAnomalous).toBe(true);
  });
});
```

## 7. 测试覆盖率要求

### 前端覆盖率目标
- 组件测试覆盖率: 80%+
- 工具函数测试覆盖率: 90%+
- 集成测试覆盖率: 70%+

### 后端覆盖率目标
- 服务层测试覆盖率: 90%+
- 控制器测试覆盖率: 85%+
- 集成测试覆盖率: 80%+

### 数据库测试目标
- 关键查询测试覆盖率: 100%
- 数据迁移测试覆盖率: 100%

### 合约测试目标
- 核心功能测试覆盖率: 100%
- 边界条件测试覆盖率: 95%+