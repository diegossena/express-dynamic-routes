import * as jwt from 'utils/jwt'
import Api from 'utils/api'
import { NextFunction } from 'express'
// Types
interface ApiRequest extends Api.Request {
  body: Api.Session.Post.Body
}
export type ApiResponse = Api.Response<Api.Session.Get>
// Middleware
export default (request: ApiRequest, response: ApiResponse, next: NextFunction) => {
  try {
    request.context.auth_uid = jwt.verify(request.cookies.token).uid
  } catch (error) { }
  if (request.originalUrl !== '/session') {
    if (!request.context.auth_uid) {
      response
        .writeHead(404, {
          'Set-Cookie': 'token=; Path=/; expires=' + new Date(0)
        })
        .end()
    }
  }
  next()
}