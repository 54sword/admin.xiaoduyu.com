
// 生产环境配置
let config = {
  debug: false,
  host: 'localhost',
  port: 4000,

  auth_cookie_name: 'admin.xiaoduyu.com',

  // css modules
  class_scoped_name: '[hash:base64:3]',

  // 静态资源路径
  public_path: '//admin.xiaoduyu.com',

  // api
  api_url: 'http://admin.xiaoduyu.com'
}

// 开发环境配置
if (process.env.NODE_ENV == 'development') {
  config.debug = true
  config.port = 5000
  config.class_scoped_name = '[name]_[local]__[hash:base64:5]'
  config.public_path = '//localhost:5000'
  config.api_url = 'http://localhost:3000'
  // config.api_url = 'http://admin.xiaoduyu.com'
}

module.exports = config
