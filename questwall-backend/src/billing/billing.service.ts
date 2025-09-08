import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  getReport(date: string) {
    // 实现获取计费报告逻辑
    return {
      date,
      totalRevenue: '1000',
      totalPayout: '800',
      netProfit: '200',
      currency: 'USD',
    };
  }
}