const fs = require('fs')
const webpack = require('webpack')

const { consoleTip } = require('./utils')
const config = require('./webpack.config')

consoleTip('TP5 TEST')

const compile = {
  mode: 'production',
  context: config.context,
  // entry: config.entry,
  output: config.output(),
  stats: config.stats,
  cache: true,
  plugins: config.plugins,
  module: config.module,
  resolve: config.resolve,
  optimization: config.optimization
}

module.exports = compile;