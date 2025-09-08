import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: any) {
    const { tg_id, wallet_addr, locale } = userData;
    const result = await this.databaseService.query(
      'INSERT INTO users (tg_id, wallet_addr, locale) VALUES ($1, $2, $3) RETURNING *',
      [tg_id, wallet_addr, locale]
    );
    return result.rows[0];
  }

  async findByTgId(tg_id: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM users WHERE tg_id = $1',
      [tg_id]
    );
    return result.rows[0];
  }

  async updateWalletAddress(userId: number, wallet_addr: string) {
    const result = await this.databaseService.query(
      'UPDATE users SET wallet_addr = $1 WHERE id = $2 RETURNING *',
      [wallet_addr, userId]
    );
    return result.rows[0];
  }
}