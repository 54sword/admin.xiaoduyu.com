var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

var config = require('./config')

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: true
})

module.exports = {

  devtool: 'source-map',

  entry: {
    app: [
      // 让客户端支持 async 和 await
      'babel-polyfill',
      './client/index',
      // 热更新
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    ],
    vendors: [
      'react',
      'react-dom',
      'react-router',
      'babel-polyfill',
      'redux',
      'react-redux',
      'react-document-meta',
      'axios'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: config.public_path + "/"
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  module: {


    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0',
      },

      {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: `css`,
                options: {
                  // css module
                  modules: true,
                  localIdentName: config.class_scoped_name,
                  // If you are having trouble with urls not resolving add this setting.
                  // See https://github.com/webpack-contrib/css-loader#url
                  // url: false,
                  // 压缩css
                  minimize: true,
                  sourceMap: true
                }
            }, {
                loader: `sass`,
            }],
            // use style-loader in development
            fallback: "style"
        })
      },

      {
        test: /\.css$/,
        use: extractSass.extract({
            use: [{
                loader: `css`,
            }],
            // use style-loader in development
            fallback: "style"
        })
      },

      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=40000' }
    ]
  },

  plugins: [

    // 定义环境变量
    new webpack.DefinePlugin({
      // 是否是生产环境
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      // 是否是 Node
      '__NODE__': JSON.stringify(process.env.__NODE__),
      // 是否是开发环境
      '__DEV__': JSON.stringify(process.env.NODE_ENV == 'development')
    }),

    extractSass,

    // 将多个入口 chunk 的公共模块。通过将公共模块拆出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.bundle.js'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common-child',
      filename: 'common-child.bundle.js',
      children: true,
      deepChildren: true
    }),

    // 创建index.ejs模版文件
    new HtmlwebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.ejs'),
      template: 'src/view/index.html',
      public_path: config.public_path + '/',
      // cdn: config.qiniu.url + '/',
      meta: '<%- meta %>',
      htmlDom: '<%- html %>',
      reduxState: '<%- reduxState %>'
    }),

    // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    new webpack.NamedModulesPlugin(),
    // 开发环境的热更新
    new webpack.HotModuleReplacementPlugin(),
    // 启用此插件后，webpack 进程遇到错误代码将不会退出
    new webpack.NoEmitOnErrorsPlugin()

    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, 'client/sw.js'),
    // })

  ]
}
