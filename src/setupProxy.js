const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(proxy('/api', { target: `http://localhost:${process.env.SERVER_PORT}/` }))
  app.use(proxy('/auth', { target: `http://localhost:${process.env.SERVER_PORT}/` }))
  app.use(proxy('/sign-s3', { target: `http://localhost:${process.env.SERVER_PORT}/` }))
}