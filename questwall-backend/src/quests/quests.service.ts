import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// 模拟数据库存储
let quests = [
  {
    id: 1,
    ownerId: 1001,
    type: 'join_channel',
    title: '关注频道 @your_channel',
    description: '关注我们的频道以获取最新动态',
    reward: { type: 'stars', amount: '5' },
    limits: { dailyCap: 100, perUserCap: 1 },
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: 2,
    ownerId: 1002,
    type: 'join_group',
    title: '加入群组 @your_group',
    description: '加入我们的群组参与讨论',
    reward: { type: 'jetton', amount: '10', assetAddr: 'EQ...' },
    limits: { dailyCap: 50, perUserCap: 1 },
    status: 'active',
    createdAt: new Date(),
  },
];

let actions = [];

@Injectable()
export class QuestsService {
  findAll(page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = quests.slice(startIndex, endIndex);
    
    return {
      items,
      total: quests.length,
    };
  }

  findOne(id: number) {
    const quest = quests.find(q => q.id === id);
    if (!quest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    return quest;
  }

  create(createQuestDto: any) {
    const newQuest = {
      id: quests.length + 1,
      ...createQuestDto,
      status: 'draft',
      createdAt: new Date(),
    };
    quests.push(newQuest);
    return newQuest;
  }

  claim(userId: number, id: number) {
    const quest = this.findOne(id);
    
    // 检查用户是否已经达到个人上限
    const userActions = actions.filter(
      action => action.userId === userId && action.questId === id
    );
    
    if (userActions.length >= quest.limits.perUserCap) {
      return {
        success: false,
        message: '您已达到此任务的个人上限',
      };
    }
    
    // 创建动作记录
    const action = {
      id: actions.length + 1,
      userId,
      questId: id,
      status: 'claimed',
      createdAt: new Date(),
    };
    actions.push(action);
    
    return {
      success: true,
      message: `任务 ${id} 已领取`,
      actionId: action.id,
    };
  }

  submit(userId: number, id: number, submitDto: any) {
    const action = actions.find(
      a => a.userId === userId && a.questId === id
    );
    
    if (!action) {
      return {
        success: false,
        message: '请先领取任务',
      };
    }
    
    // 更新动作记录
    action.proof = submitDto.proof;
    action.status = 'submitted';
    action.submittedAt = new Date();
    
    return {
      success: true,
      message: `任务 ${id} 的证明已提交`,
      action,
    };
  }

  reward(userId: number, id: number) {
    const action = actions.find(
      a => a.userId === userId && a.questId === id
    );
    
    if (!action) {
      return {
        success: false,
        message: '未找到任务记录',
      };
    }
    
    // 更新动作记录
    action.status = 'rewarded';
    action.rewardedAt = new Date();
    
    // 生成奖励ID
    const rewardId = uuidv4();
    
    return {
      success: true,
      message: `任务 ${id} 的奖励已发放`,
      rewardId,
    };
  }
}