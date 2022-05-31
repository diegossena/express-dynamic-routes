import knex from 'knex'
import config from 'utils/config'
// Tables
export interface User {
  id: number
  uid: string
  username: string
  password: string
  name: string
  email: string
}
// Declare Knex Tables
declare module 'knex/types/tables' {
  interface Tables {
    users: User
  }
}
// Module
console.log(true)
export default knex({
  client: 'mysql2',
  connection: {
    ...config.database.connection,
    supportBigNumbers: true,
    bigNumberStrings: true
  }
})
