const { Pool } = require('pg')
require('dotenv').config({path: '../.env'})

console.log(`Connected to ${process.env.PGDATABASE} on ${process.env.PGHOST}`)

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 40,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
})

module.exports = {
  //Use if you only need a single query statement. PG with return client when finished.
  async query(text, params) {
    const res = await pool.query(text, params)
    return res
  },

  //Use if you need to do multiple query statements, don't forget to return the client.
  async getClient() {
    const client = await pool.connect()
    const query = client.query
    const release = client.release

    client.release = () => {
      client.query = query
      client.release = release
      return release.apply(client)
    }

    return client
  },
}
