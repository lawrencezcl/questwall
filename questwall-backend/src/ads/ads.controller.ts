import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post('callback/adsgram')
  adsgramCallback(@Body() callbackDto: any) {
    return this.adsService.handleAdsgramCallback(callbackDto);
  }

  @Get('billing/report')
  @UseGuards() // 这里应该使用管理员权限守卫
  getBillingReport(@Query('date') date: string) {
    return this.adsService.getBillingReport(date);
  }
}