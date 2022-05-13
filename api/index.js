const Pool = require('pg-pool');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

async function connectDB() {
  const client = await pool.connect();
  try {
    const createPlayers = `CREATE TABLE IF NOT EXISTS players (
      "username" VARCHAR(100) PRIMARY KEY NOT NULL,
      "pwd" CHAR(60) NOT NULL,
      "pincode" CHAR(60) NOT NULL
    )`;
    await client.query(createPlayers);
    const createWallets = `CREATE TABLE IF NOT EXISTS wallets (
      "username" VARCHAR(100) PRIMARY KEY REFERENCES players(username),
      "wallet_address" CHAR(42) NOT NULL,
      "currency" VARCHAR(100) NOT NULL,
      "balance" VARCHAR(32) NOT NULL
    )`;
    await client.query(createWallets);
    await client.query('COMMIT');
  } catch (e) {
    console.error(e.stack);
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { connectDB, pool };
