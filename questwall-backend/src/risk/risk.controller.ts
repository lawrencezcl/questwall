import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RiskService } from './risk.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('risk')
@UseGuards(AuthGuard)
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post('fp')
  submitFingerprint(@Body() fpDto: any) {
    return this.riskService.submitFingerprint(fpDto);
  }

  @Get('score')
  getRiskScore(@Query('userId') userId: string) {
    return this.riskService.getRiskScore(userId);
  }
}