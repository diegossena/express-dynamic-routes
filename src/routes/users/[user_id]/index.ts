import Api from 'utils/api'
import { users, User } from 'routes/users'
// Types
interface ApiRequest extends Api.Request {
  params: {
    user_id: string
  }
  body: {
    name: string
  }
}
export type ApiResponse = Api.Response<
  // GET
  User
>
export function GET(request: ApiRequest, response: ApiResponse) {
  const user_id = parseInt(request.params.user_id)
  if (!user_id)
    response.status(404).end()
  const user = users.find(user => user_id === user.id)
  if (!user)
    response.status(404).end()
  response.send(user)
}
export function PUT(request: ApiRequest, response: ApiResponse) {
  const user_id = parseInt(request.params.user_id)
  if (!user_id)
    response.status(404).end()
  const user = users.find(user => user_id === user.id)
  if (!user)
    response.status(404).end()
  Object.assign(user, {
    name: request.body.name
  })
  response.status(204).end()
}
export function DELETE(request: ApiRequest, response: ApiResponse) {
  const user_id = parseInt(request.params.user_id)
  if (!user_id)
    response.status(404).end()
  const index = users.findIndex(user => user_id === user.id)
  if (index === -1)
    response.status(404).end()
  const deleted_user = users.splice(index, 1)
  if (!deleted_user)
    response.status(404).end()
  response.status(204).end()
}