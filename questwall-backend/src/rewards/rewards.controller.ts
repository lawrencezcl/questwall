import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('rewards')
@UseGuards(AuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  getMyRewards(@Request() req) {
    const userId = req.user?.tg_id || 1;
    return this.rewardsService.getMyRewards(userId);
  }

  @Post('withdraw')
  withdraw(@Body() withdrawDto: any, @Request() req) {
    const userId = req.user?.tg_id || 1;
    return this.rewardsService.withdraw(userId, withdrawDto);
  }

  @Get('payouts/:id')
  getPayoutStatus(@Param('id') id: string) {
    return this.rewardsService.getPayoutStatus(id);
  }
}