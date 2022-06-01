import express, { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
const express_app = express()
  .disable('x-powered-by')
  .use('/', express.static(path.resolve('.', 'public')))
  .use(express.json())
const port = 3000
const method_keys = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
const routes_base_url = path.resolve(__dirname, 'routes')
const express_app_methods = {
  GET: (name: string, handler: any) => express_app.get(name, handler),
  POST: (name: string, handler: any) => express_app.post(name, handler),
  PUT: (name: string, handler: any) => express_app.put(name, handler),
  PATCH: (name: string, handler: any) => express_app.patch(name, handler),
  DELETE: (name: string, handler: any) => express_app.delete(name, handler),
}
function pathToRouteUrl(path: string): string {
  if (path.length === routes_base_url.length)
    return '/'
  path = path.slice(routes_base_url.length, path.endsWith('.js') ? -3 : undefined)
    .replace(/\\/g, '/')
    .replace(/\[[a-z_]{1,}\]/g, replaceValue => `:${replaceValue.slice(1, -1)}`)
  if (path.endsWith('/index'))
    return path.slice(0, -6)
  return path
}
function responseOptions(allowed_methods: string[], statusCode: number) {
  return (_request: Request, response: Response) => response
    .writeHead(statusCode, { Allow: allowed_methods.join(', ') })
    .end()
}
function loadRoutes(routes_path = routes_base_url) {
  fs.promises.readdir(
    routes_path,
    { withFileTypes: true }
  ).then(routes => routes
    .map(route => {
      const route_path = path.join(routes_path, route.name)
      if (route.isDirectory()) {
        loadRoutes(route_path)
      } else if (route.isFile()) {
        const methods = require(route_path)
        if (route.name === '_middleware.js') {
          const route_url = pathToRouteUrl(routes_path)
          express_app.use(route_url, methods.default)
        } else {
          const route_url = pathToRouteUrl(route_path) // /users/:user_id
          const allowed_methods = method_keys
            .filter(method_key => {
              if (methods[method_key]) {
                const express_app_method = express_app_methods[method_key]
                express_app_method(route_url, methods[method_key])
              }
              return methods[method_key]
            })
          if (allowed_methods.length) {
            method_keys
              .filter(method_key => !methods[method_key])
              .map(method_key => {
                const express_app_method = express_app_methods[method_key]
                express_app_method(route_url, responseOptions(allowed_methods, 405))
              })
            express_app.options(route_url, responseOptions(allowed_methods, 200))
          }
        }
      }
    })
  ).catch(error => console.error(routes_path, error))
} loadRoutes()
express_app.listen(port, () => {
  console.info(`Listening on port ${port}`)
})