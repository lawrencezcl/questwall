import { Test, TestingModule } from '@nestjs/testing';
import { QuestsService } from './quests.service';

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
      const result = service.claim(123456789, 1);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('submit', () => {
    it('should submit quest proof successfully', () => {
      // 先领取任务
      service.claim(123456789, 1);
      
      // 然后提交证明
      const result = service.submit(123456789, 1, { proof: 'test_proof' });
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });

  describe('reward', () => {
    it('should reward a quest successfully', () => {
      // 先领取任务
      service.claim(123456789, 1);
      
      // 然后发放奖励
      const result = service.reward(123456789, 1);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });
});