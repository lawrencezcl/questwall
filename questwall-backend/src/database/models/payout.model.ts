import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PayoutModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(payoutData: any) {
    const { beneficiary_id, asset, amount, status, tx_hash } = payoutData;
    const result = await this.databaseService.query(
      'INSERT INTO payouts (beneficiary_id, asset, amount, status, tx_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [beneficiary_id, asset, amount, status, tx_hash]
    );
    return result.rows[0];
  }

  async findById(id: number) {
    const result = await this.databaseService.query(
      'SELECT * FROM payouts WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async updateStatus(id: number, status: string) {
    const result = await this.databaseService.query(
      'UPDATE payouts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  async updateTxHash(id: number, tx_hash: string) {
    const result = await this.databaseService.query(
      'UPDATE payouts SET tx_hash = $1 WHERE id = $2 RETURNING *',
      [tx_hash, id]
    );
    return result.rows[0];
  }
}