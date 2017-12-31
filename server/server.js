import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import DocumentMeta from 'react-document-meta'

// 服务端渲染依赖
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { matchPath } from 'react-router-dom'
import { Provider } from 'react-redux'

import configureStore from '../src/store'
import { loadUserInfo } from '../src/actions/user'

// 路由组件
import { RouteArr, Router } from '../src/router'


// 配置
import config from '../config'

const app = express()

// webpack热更新
const runWebpack = ()=>{

  // https://github.com/glenjamin/webpack-hot-middleware/blob/master/example/server.js
  const webpack = require('webpack')
  const webpackConfig = require('../webpack.development.config.js')
  const compiler = webpack(webpackConfig)

  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }))

  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }))
}

if (process.env.NODE_ENV === 'development') runWebpack()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(config.auth_cookie_name));

app.use(compress())
app.use(express.static(__dirname + '/../dist'))
app.use(express.static(__dirname + '/../public'))

app.use(function (req, res, next) {
  // 计算页面加载完成花费的时间
  var exec_start_at = Date.now()
  var _send = res.render
  res.render = function () {
    if (process.env.NODE_ENV === 'development') {
      console.log(req.url + ' ' + String(Date.now() - exec_start_at) + ' ms')
    } else {
      // 发送Header
      res.set('X-Execution-Time', String(Date.now() - exec_start_at) + ' ms')
    }
    // 调用原始处理函数
    return _send.apply(res, arguments)
  }
  next()
})

app.use('/sign', (function(){

  var router = express.Router();

  router.post('/in', (req, res)=>{
    let accessToken = req.body.access_token || null;

    if (!accessToken) return res.send({ success: false })

    // let expires = req.body.expires;
    res.cookie(config.auth_cookie_name, accessToken, { path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
    res.send({ success: true })
  })

  router.post('/out', (req, res)=>{
    res.clearCookie(config.auth_cookie_name)
    res.send({ success: true })
  })

  return router

}()))

app.get('*', async function(req, res){

  const store = configureStore({})

  console.log(store.getState())

  let accessToken = req.cookies[config.auth_cookie_name] || null
        // expires = req.cookies['expires'] || 0


  let context = {}
  let userinfo = null

  if (accessToken) {
    let result = await loadUserInfo({ accessToken })(store.dispatch, store.getState)
    if (result.success) {
      userinfo = result.data
    }
  }

  let _route = null,
      _match = null

  // console.log(matchPath(req.url.split('?')[0], RouteArr))

  RouteArr.some(route => {
    let match = matchPath(req.url.split('?')[0], route)
    if (match && match.path) {
      _route = route
      _match = match
      return true
    }
  })

  // console.log(_match);
  // console.log(_route.component.WrappedComponent);

  // console.log(_route.component.WrappedComponent.defaultProps.component);

  if (
    _match &&
    _route &&
    _route.component &&
    _route.component.WrappedComponent &&
    _route.component.WrappedComponent.defaultProps &&
    // _route.component.WrappedComponent.defaultProps.component &&
    _route.component.WrappedComponent.defaultProps.loadData
  ) {
    context = await _route.component.WrappedComponent.defaultProps.loadData({ store, match: _match, userinfo })
  }

  const _Router = Router({ userinfo })

  // console.log(context);



  let html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <_Router />
      </StaticRouter>
    </Provider>
  )

  let reduxState = JSON.stringify(store.getState()).replace(/</g, '\\x3c');

  if (context.code) {
    if (context.code == 301) {
      res.writeHead(301, { Location: context.url })
      res.end()
      return
    }
    res.status(context.code)
  }

  // 获取页面的meta，嵌套到模版中
  let meta = DocumentMeta.renderAsHTML()

  res.render('../dist/index.ejs', { meta, html, reduxState })
  res.end()
})

app.listen(config.port);
console.log('server started on port ' + config.port)
