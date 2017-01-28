
'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpriteGenerator = require('..')

module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: '[name].js',
    publicPath: ''
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: 'index.htm'
    }),
    new SpriteGenerator({
      cwd: path.resolve(__dirname, 'src/assets'),
      glob: '*.png',
      result: 'images/sprite.png'
    })
  ]
}
