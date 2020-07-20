const fs = require('fs')
const webpack = require('webpack')

const { outputDev } = require('./base')
const { consoleTip, pathResolve } = require('./utils')
const config = require('./webpack.config')

consoleTip('TP5 TEST')

const compile = {
  mode: 'development',
  context: config.context,
  // entry: config.entry,
  output: config.output(),
  devtool: config.devtool,
  stats: config.stats,
  cache: true,
  plugins: config.plugins,
  module: config.module,
  resolve: config.resolve,
  optimization: config.optimization
}

module.exports = compile;