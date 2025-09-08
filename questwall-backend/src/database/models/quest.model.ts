import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class QuestModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(questData: any) {
    const { owner_id, type, reward_type, reward_amount, reward_asset, limits, status } = questData;
    const result = await this.databaseService.query(
      'INSERT INTO quests (owner_id, type, reward_type, reward_amount, reward_asset, limits, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [owner_id, type, reward_type, reward_amount, reward_asset, limits, status]
    );
    return result.rows[0];
  }

  async findAll(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const result = await this.databaseService.query(
      'SELECT * FROM quests ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );
    const countResult = await this.databaseService.query('SELECT COUNT(*) FROM quests');
    return {
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  async findById(id: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM quests WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async updateStatus(id: number, status: string) {
    const result = await this.databaseService.query(
      'UPDATE quests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }
}