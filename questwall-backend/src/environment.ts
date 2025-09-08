export const environment = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://questwall:questwall123@localhost:5432/questwall',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  clickhouseUrl: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
};