
// 生产环境配置
let config = {
  debug: false,
  host: 'localhost',
  port: 4000,

  auth_cookie_name: 'admin.xiaoduyu.com',

  // css modules
  class_scoped_name: '[hash:base64:3]',

  // 静态资源路径
  public_path: '//localhost:4000',

  // api
  api_url: 'https://api.xiaoduyu.com',
  api_verstion: 'api/v1'
}

// 开发环境配置
if (process.env.NODE_ENV == 'development') {
  config.debug = true
  config.class_scoped_name = '[name]_[local]__[hash:base64:5]'
}

module.exports = config
