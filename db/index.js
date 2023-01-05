const { Pool } = require('pg')
require('dotenv').config({path: '../.env'})

console.log(process.env.PGDATABASE, process.env.PGUSER, process.env.PGHOST)

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

// module.exports = {
//   query: (text, params) => {
//     pool.query(text, params)
//   },
//   getClient: () => pool.connect(),
// };

module.exports = {
  async query(text, params) {
    //const start = Date.now()
    const res = await pool.query(text, params)
    //const duration = Date.now() - start
    //console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  },

  async getClient() {
    const client = await pool.connect()
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    // const timeout = setTimeout(() => {
    //   console.error('A client has been checked out for more than 5 seconds!')
    //   console.error(`The last executed query on this client was: ${client.lastQuery}`)
    // }, 10000)
    // monkey patch the query method to keep track of the last query executed
    // client.query = (...args) => {
    //   client.lastQuery = args
    //   return query.apply(client, args)
    // }
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout)
      // set the methods back to their old un-monkey-patched version
      client.query = query
      client.release = release
      return release.apply(client)
    }
    return client
  },
}
