import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

// Ejemplo de uso:
// import pool from './db';
// const result = await pool.query('SELECT NOW()');
// console.log(result.rows);