import Api from 'utils/api'
// Types
export interface User {
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
let increment = 0
export const users: User[] = []
export function GET(_request: ApiRequest, response: ApiResponse) {
  response.send(users)
}
export function POST(request: ApiRequest, response: ApiResponse) {
  const user_id = ++increment
  users.push({
    id: user_id,
    name: request.body.name,
  })
  response.send({ id: user_id })
}