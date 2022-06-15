import Knex from 'knex'
import fs from 'fs'
// Cached
const config = JSON.parse(
  fs.readFileSync('../config.json')
)
const knex = Knex({
  client: 'mysql2',
  connection: config.database
})
//
async function start() {

} start()