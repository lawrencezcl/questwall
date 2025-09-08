import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { environment } from '../environment';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: environment.databaseUrl,
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  }

  async getClient() {
    return await this.pool.connect();
  }
}