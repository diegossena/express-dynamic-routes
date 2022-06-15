import express, { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import next from 'next'
import config from 'utils/config'
import { spawn } from 'child_process'
// Cached
const next_server = next({
  dev: !!process.argv[2],
  port: process.argv[2]
    ? parseInt(process.argv[2])
    : config.port,
  conf: {
    distDir: 'app',
    esModule: true
  }
})
const appRequestHandle = next_server.getRequestHandler()
const routes_base_url = path.resolve(next_server.options.conf.distDir, 'routes')
const express_app = express()
  .disable('x-powered-by')
  .use(express.json())
express_app
  .listen(next_server.port, () => {
    console.info(`Listening on port ${next_server.port}`)
  })
const method_keys = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
// Utils
const express_app_methods = {
  GET: (name: string, handler: any) => express_app.get(name, handler),
  POST: (name: string, handler: any) => express_app.post(name, handler),
  PUT: (name: string, handler: any) => express_app.put(name, handler),
  PATCH: (name: string, handler: any) => express_app.patch(name, handler),
  DELETE: (name: string, handler: any) => express_app.delete(name, handler),
}
function pathToRouteUrl(path: string) {
  if (path.length === routes_base_url.length) {
    path = ''
  } else {
    path = path.slice(routes_base_url.length + 1, path.endsWith('.js') ? -3 : undefined)
      .replace(/\\/g, '/')
      .replace(/\[[a-z_]{1,}\]/g, replaceValue => `:${replaceValue.slice(1, -1)}`)
    if (path.endsWith('index'))
      path = path.slice(0, -6)
  }
  return `/api/${path}`
}
function responseOptions(allowed_methods: string[], statusCode: 200 | 405) {
  return (_request: Request, response: Response) => response
    .writeHead(statusCode, { Allow: allowed_methods.join(', ') })
    .end()
}
function loadRoutes(routes_path = routes_base_url) {
  return fs.promises.readdir(
    routes_path,
    { withFileTypes: true }
  ).then(routes => Promise.all(
    routes.map(route => {
      const route_path = path.join(routes_path, route.name)
      if (route.isDirectory())
        return loadRoutes(route_path)
      const methods = require(route_path)
      const route_url = pathToRouteUrl(route_path)
      if (route.name === '_middleware.js')
        return express_app.use(
          route_url,
          methods.default
        )
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
    ))
  ).catch(error => console.error(routes_path, error))
}
// Services
if (!process.argv[2]) {
  loadRoutes()
    .then(() => (
      express_app.all('*', (request, response) => (
        appRequestHandle(request, response)
      ))
    ))
}
next_server.prepare()
  .then(() => {
    if (process.argv[2]) {
      const defaultRoutesLength = express_app._router.stack.length
      spawn(
        'babel src --watch',
        [
          '--out-dir', 'app',
          '--extensions', '".ts"',
          '--ignore', '"src/pages,src/index.ts"'
        ],
        { shell: true }
      ).stdout.on('data', data => {
        if (data.indexOf('0 files') === -1) {
          express_app._router.stack.splice(defaultRoutesLength)
          loadRoutes()
            .then(() => {
              express_app.all('*', (request, response) => (
                appRequestHandle(request, response)
              ))
              process.stdout.write(`[${new Date().toLocaleString()}] ${data}`)
            })
        }
      })
    }
  })