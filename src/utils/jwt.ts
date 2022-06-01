import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import config from './config'
if (!config.https.privateKey)
  throw 'config.https.privateKey not found'
const privateKey = fs.readFileSync(
  path.resolve(config.https.path, config.https.privateKey)
)
export interface Payload {
  uid: string
}
export interface JwtPayload extends Payload {
  iat: number
  exp: number
}
export function verify(token: string) {
  return jwt.verify(token, privateKey, { algorithms: ['RS256'] }) as JwtPayload
}
export function sign(payload: Payload, expiresIn: Date) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: expiresIn.getTime() })
}