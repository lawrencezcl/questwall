import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
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
      // 模拟有效的 Telegram initData
      const initData = 'user=%7B%22id%22%3A123456789%7D&hash=valid_hash';
      
      // 模拟环境变量
      process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
      
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