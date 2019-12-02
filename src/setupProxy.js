const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(proxy('/api', { target: `${process.env.REACT_APP}${process.env.REACT_APP_SERVER_PORT}/` }))
  app.use(proxy('/auth', { target: `${process.env.REACT_APP}${process.env.REACT_APP_SERVER_PORT}/` }))
  app.use(proxy('/sign-s3', { target: `${process.env.REACT_APP}${process.env.REACT_APP_SERVER_PORT}/` }))
}