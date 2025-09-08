import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('telegram')
  async telegramAuth(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.telegramAuth(authDto.initData);
    // 设置 JWT cookie
    response.cookie('token', result.token, {
      httpOnly: true,
      maxAge: result.expiresIn * 1000,
    });
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Req() request: Request) {
    const token = request.cookies['token'];
    return this.authService.refreshToken(token);
  }
}