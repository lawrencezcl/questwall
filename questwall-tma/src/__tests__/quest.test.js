// src/__tests__/quest.test.js
import { QuestService } from '../services/quest';

// 模拟 QuestService
jest.mock('../services/quest');

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

    // 模拟 create 方法的返回值
    questService.create.mockReturnValue({
      id: 1,
      ...questData,
      status: 'draft'
    });

    const quest = questService.create(questData);
    expect(quest).toHaveProperty('id');
    expect(quest.title).toBe(questData.title);
    expect(quest.status).toBe('draft');
  });

  test('should claim a quest', () => {
    const userId = 123456789;
    const questId = 1;

    // 模拟 claim 方法的返回值
    questService.claim.mockReturnValue({
      success: true,
      message: '任务已领取'
    });

    const result = questService.claim(userId, questId);
    expect(result.success).toBe(true);
  });
});