import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('quests')
@UseGuards(AuthGuard)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.questsService.findAll(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questsService.findOne(+id);
  }

  @Post()
  create(@Body() createQuestDto: any, @Request() req) {
    // 在实际应用中，应该从 JWT token 中获取用户信息
    const userId = req.user?.tg_id || 1;
    return this.questsService.create({ ...createQuestDto, ownerId: userId });
  }

  @Post(':id/claim')
  claim(@Param('id') id: string, @Request() req) {
    const userId = req.user?.tg_id || 1;
    return this.questsService.claim(userId, +id);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() submitDto: any, @Request() req) {
    const userId = req.user?.tg_id || 1;
    return this.questsService.submit(userId, +id, submitDto);
  }

  @Post(':id/reward')
  reward(@Param('id') id: string, @Request() req) {
    const userId = req.user?.tg_id || 1;
    return this.questsService.reward(userId, +id);
  }
}