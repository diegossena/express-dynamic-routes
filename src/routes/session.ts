import * as jwt from 'utils/jwt'
import { compareSync as hashCompare } from 'bcrypt'
import { hourTime } from 'utils/date'
import Api from 'utils/api'
import knex from 'utils/database'
// Types
interface ApiRequest extends Api.Request {
  body: Api.Session.Post.Body
}
export type ApiResponse = Api.Response<Api.Session.Get>
// Methods
export async function GET(request: ApiRequest, response: ApiResponse) {
  if (!request.context.auth_uid) {
    response
      .writeHead(404, {
        'Set-Cookie': 'token=; Path=/; expires=' + new Date(0)
      })
      .end()
  }
  const user = await knex('users')
    .select('name', 'email')
    .where({ uid: request.context.auth_uid })
    .first()
  if (!user)
    return response.status(404).end()
  response.json({
    uid: request.context.auth_uid,
    name: user.name,
    email: user.email
  })
}
export async function POST(request: ApiRequest, response: ApiResponse) {
  if (!request.body.email || !request.body.password)
    return response.status(400).json({
      message: 'Usuário e senha é obrigatório'
    })
  const user = await knex('users')
    .select('uid', 'password', 'name')
    .where({ email: request.body.email })
    .first()
  if (!user || !hashCompare(request.body.password, user.password)) {
    return response.status(400).json({ message: 'Usuário ou Senha inválidos' })
  }
  const expiresIn = new Date(Date.now() + 10 * hourTime)
  const token = jwt.sign({ uid: user.uid }, expiresIn)
  response
    .setHeader('Set-Cookie', `token=${token};Path=/;HttpOnly;expires=${expiresIn.toUTCString()}`)
    .send({
      uid: user.uid,
      name: user.name,
      email: request.body.email
    })
}
export async function DELETE(_request: ApiRequest, response: ApiResponse) {
  response
    .writeHead(204, {
      'Set-Cookie': 'token=; Path=/; expires=' + new Date(0)
    })
    .end()
}
