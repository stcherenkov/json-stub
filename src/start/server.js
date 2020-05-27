const Koa = require('koa')
const _ = require('lodash')

const responses = require('./responses')

module.exports = ({ port }) => {
  const app = new Koa()

  app.use(ctx => {
    const { response, request } = ctx
    response.set('Access-Control-Allow-Origin', request.headers.origin)
    response.set('Access-Control-Allow-Credentials', 'true')
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT')
    response.set('Access-Control-Allow-Headers', 'Authorization,DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type')

    if (request.method === 'OPTIONS') {
      response.set('Content-Type', 'text/plain; charset=UTF-8')
      response.status = 204
      return
    }

    const dir = _.trim(request.path, '/')
    const path = dir === ''
      ? ['/']
      : dir.split('/')
    const rs = responses.match(request.method, path)

    if (!rs) {
      response.status = 404
      return
    }

    response.set('Content-Type', 'application/json; charset=UTF-8')
    response.set(rs.headers)
    response.status = rs.status
    ctx.body = rs.template
      ? rs.template({
        ...rs.params,
        query: request.query,
      })
      : rs.body
  })

  app.listen(port, () => console.log(`Stub server started at http://localhost:${port}`))
}
