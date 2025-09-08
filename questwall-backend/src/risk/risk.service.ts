import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskService {
  submitFingerprint(fpDto: any) {
    // 实现提交设备指纹逻辑
    return {
      success: true,
      message: '设备指纹已提交',
    };
  }

  getRiskScore(userId: string) {
    // 实现获取风险分逻辑
    return {
      userId,
      score: 50, // 风险分，0-100，分数越高风险越大
      factors: [
        'device_fingerprint',
        'behavior_pattern',
        'ip_frequency',
      ],
    };
  }
}