import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
export declare namespace Api {
  interface Request extends ExpressRequest {
    context: { auth_uid: string }
  }
  type Response<T> = ExpressResponse<{ message: string } | T>
  namespace Users {
    interface Get {
      uid: string
      name: string
      email: string
    }
    namespace Post {
      interface Body {
        username: string
        password: string
        name: string
        email: string
      }
    }
    interface Post {
      uid: string
    }
    namespace Uid {
      interface Get {
        uid: string
        name: string
        email: string
      }
    }
  }
  namespace Session {
    interface Get {
      uid: string
      name: string
      email: string
    }
    namespace Post {
      interface Body {
        email: string
        password: string
      }
    }
  }
}
export default Api
