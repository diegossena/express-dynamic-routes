import fs from 'fs'
import crypto from 'crypto'
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
  port: number
  https?: {
    port: number,
    path: string
    privateKey: string
    certificate: string
    ca: string
  }
  secret?: string
}
const config: Config = JSON.parse(fs.readFileSync('./config.json').toString())
if (config.https) {
  if (!config.https.privateKey)
    throw 'config.https.privateKey not found'
} else {
  if (!config.secret) {
    config.secret = crypto.randomBytes(128).toString()
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
  }
}
export default config
