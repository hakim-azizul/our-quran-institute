import pg from 'pg';

const { Pool } = pg;

let pool = null;

export function getDbPool() {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.DIRECT_URL ||
      'postgresql://postgres.lxazaytwwudocouivoqc:WamyDorms2026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }

  return pool;
}

export async function query(text, params) {
  const p = getDbPool();
  return p.query(text, params);
}

export async function checkDatabaseConnection() {
  try {
    const start = Date.now();
    const res = await query('SELECT NOW() as server_time, current_database() as database_name, version();');
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      serverTime: res.rows[0].server_time,
      database: res.rows[0].database_name,
      latencyMs,
      version: res.rows[0].version,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

export default {
  getDbPool,
  query,
  checkDatabaseConnection,
};
