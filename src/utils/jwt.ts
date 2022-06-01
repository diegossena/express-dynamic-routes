import jwt from 'jsonwebtoken'
import config from './config'
const secretOrPublicKey = config.https?.privateKey || config.secret
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