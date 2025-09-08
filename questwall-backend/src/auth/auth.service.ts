import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async telegramAuth(initData: string) {
    // 验证 Telegram initData
    const isValid = this.verifyTelegramInitData(initData, process.env.TELEGRAM_BOT_TOKEN);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram initData');
    }

    // 解析用户信息
    const userData = this.parseInitData(initData);
    
    // 生成 JWT token
    const payload = { 
      tg_id: userData.tg_id,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name
    };
    
    const token = this.jwtService.sign(payload);
    
    return {
      token,
      expiresIn: 900, // 15 minutes
      user: {
        tg_id: userData.tg_id,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        locale: userData.locale || 'en'
      }
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newToken = this.jwtService.sign(payload);
      return {
        token: newToken,
        expiresIn: 900
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private verifyTelegramInitData(initData: string, botToken: string): boolean {
    // 实现 Telegram initData 验证逻辑
    // 参考：https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    
    // 按键名排序参数
    const sortedParams = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
    const dataCheckString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');
    
    // 生成密钥
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // 计算哈希值
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    // 比较哈希值
    return calculatedHash === hash;
  }

  private parseInitData(initData: string): any {
    // 解析 Telegram initData
    const params = new URLSearchParams(initData);
    const userJson = params.get('user');
    
    if (userJson) {
      return JSON.parse(decodeURIComponent(userJson));
    }
    
    return {};
  }
}