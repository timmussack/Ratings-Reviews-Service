const { Pool } = require('pg')
require('dotenv').config({path: '../.env'});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}
