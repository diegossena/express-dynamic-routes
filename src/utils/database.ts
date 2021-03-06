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
export default knex({
  client: 'mysql2',
  connection: {
    ...config.database,
    supportBigNumbers: true,
    bigNumberStrings: true
  }
})
