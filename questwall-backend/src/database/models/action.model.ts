import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ActionModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(actionData: any) {
    const { user_id, quest_id, proof, risk_score, status } = actionData;
    const result = await this.databaseService.query(
      'INSERT INTO actions (user_id, quest_id, proof, risk_score, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, quest_id, proof, risk_score, status]
    );
    return result.rows[0];
  }

  async findByUserAndQuest(userId: number, questId: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM actions WHERE user_id = $1 AND quest_id = $2',
      [userId, questId]
    );
    return result.rows[0];
  }

  async updateStatus(id: number, status: string) {
    const result = await this.databaseService.query(
      'UPDATE actions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  async updateProof(id: number, proof: any) {
    const result = await this.databaseService.query(
      'UPDATE actions SET proof = $1 WHERE id = $2 RETURNING *',
      [proof, id]
    );
    return result.rows[0];
  }
}