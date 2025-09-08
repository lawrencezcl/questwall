import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('report')
  @UseGuards() // 这里应该使用管理员权限守卫
  getReport(@Query('date') date: string) {
    return this.billingService.getReport(date);
  }
}