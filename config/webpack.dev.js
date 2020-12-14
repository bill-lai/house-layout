const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './example/main.js'
  },
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  ["@babel/transform-runtime"]
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({paths: ["dist"] })
  ],
  devtool: 'inline-source-map',  // 将编译后的代码映射回原始源代码，更容易地追踪错误和警告
  devServer: {
    contentBase: './dist',  //项目根路径
    watchContentBase: true,
    hot: true,  //开启热模替换功能
    open: true,  //自动打开浏览器
    port: 8001
  },
  mode: 'development'
}