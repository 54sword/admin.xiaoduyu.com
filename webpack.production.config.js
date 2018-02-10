var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

var config = require('./config')

const extractSass = new ExtractTextPlugin({
    filename: "[name].[hash].css"
})

module.exports = {

  entry: {
    app: [
      './client/index'
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
    filename: '[name].[hash].js',
    publicPath: config.public_path + "/"
  },

  resolveLoader: {
    moduleExtensions: ["-loader"]
  },

  module: {

    rules: [

      // 支持解析js
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015,presets[]=react,presets[]=stage-0',
      },

      // 支持解析scss
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
                  // sourceMap: true
                }
            }, {
                loader: "sass"
            }],
            // use style-loader in development
            fallback: "style"
        })
      },

      // 支持解析css
      {
        test: /\.css$/,
        use: extractSass.extract({
            use: [{
              loader: `css`
            }],
            // use style-loader in development
            // fallback: "style-loader"
        })
      },

      // 支持解析图片
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

    // 清空打包目录
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false
    }),

    extractSass,

    // 将公共部分打包在一个文件里面
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.[hash].bundle.js'
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common-child',
    //   filename: 'common-child.[hash].bundle.js',
    //   children: true,
    //   deepChildren: true
    // }),

    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      minimize: true,
      compress: {
        warnings: false
      }
    }),

    new HtmlwebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.ejs'),
      template: 'src/view/index.html',

      meta: '<%- meta %>',
      htmlDom: '<%- html %>',
      reduxState: '<%- reduxState %>',
      // public_path: config.public_path + '/',
      // cdn: config.qiniu.url + '/',
    }),

    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, 'client/sw.js'),
    // })

  ]
}
