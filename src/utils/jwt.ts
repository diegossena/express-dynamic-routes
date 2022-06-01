import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import config from './config'
import crypto from 'crypto'
let secretOrPublicKey: Buffer | string
if (config.https) {
  if (!config.https.privateKey)
    throw 'config.https.privateKey not found'
  secretOrPublicKey = fs.readFileSync(
    path.resolve(config.https.path, config.https.privateKey)
  )
} else {
  secretOrPublicKey = config.secret
  if (!secretOrPublicKey) {
    secretOrPublicKey = config.secret = crypto.randomBytes(128).toString()
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
  }
}
export interface Payload {
  uid: string
}
export interface JwtPayload extends Payload {
  iat: number
  exp: number
}
export function verify(token: string) {
  return jwt.verify(token, secretOrPublicKey, { algorithms: ['RS256'] }) as JwtPayload
}
export function sign(payload: Payload, expiresIn: Date) {
  return jwt.sign(payload, secretOrPublicKey, { algorithm: 'RS256', expiresIn: expiresIn.getTime() })
}