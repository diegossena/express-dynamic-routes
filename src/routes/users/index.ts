import Api from 'utils/api'
// Types
interface User {
  id: number
  name: string
}
interface ApiRequest extends Api.Request {
  body: {
    name: string
  }
}
export type ApiResponse = Api.Response<
  // GET
  User[]
  // POST
  | { id: number }
>
const users: User[] = []
export function GET(request: ApiRequest, response: ApiResponse) {
  response.send(users)
}
export function POST(request: ApiRequest, response: ApiResponse) {
  const new_user = {
    id: 0,
    name: request.body.name,
  }
  new_user.id = users.push(new_user)
  response.send({ id: new_user.id })
}