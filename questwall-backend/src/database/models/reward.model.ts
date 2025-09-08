import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RewardModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(rewardData: any) {
    const { user_id, quest_id, type, amount, asset, tx_hash, stars_tx_id } = rewardData;
    const result = await this.databaseService.query(
      'INSERT INTO rewards (user_id, quest_id, type, amount, asset, tx_hash, stars_tx_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, quest_id, type, amount, asset, tx_hash, stars_tx_id]
    );
    return result.rows[0];
  }

  async findByUserId(userId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM rewards WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async updateTxHash(id: number, tx_hash: string) {
    const result = await this.databaseService.query(
      'UPDATE rewards SET tx_hash = $1 WHERE id = $2 RETURNING *',
      [tx_hash, id]
    );
    return result.rows[0];
  }
}