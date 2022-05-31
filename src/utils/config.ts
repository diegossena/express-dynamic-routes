import fs from 'fs'
interface Config {
  database: {
    connection: {
      host: string
      user: string
      password: string
      database: string
      port?: number
    }
  },
  https: {
    port: number,
    path: string
    privateKey: string
    certificate: string
    ca: string
  }
}
export default JSON.parse(fs.readFileSync('./config.json').toString()) as Config
