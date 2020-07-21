const glob = require('glob')
const path = require('path')

const { context, outputPath } = require('./base')
const { bindEntry, pathResolve, bindPlugins, bindModule, bindOptimization } = require('./utils')

const env = process.env.NODE_ENV
const isProduction = env === 'production'

const config = {
  context: pathResolve('../'),
  // entry: bindEntry().data,
  output() {
    const filename = env === 'production' ? `[name].js` : `[name].js`
    return {
      // path: pathResolve(`../${isProduction ? outputPath.prod : outputPath.dev}`),
      filename: filename
    }
  },
  devtool: 'source-map',
  plugins: bindPlugins(),
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    depth: false,
    entrypoints: false,
    modules: false
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@src': path.resolve(__dirname, '../src/')
    },
    cacheWithContext: true
  },
  module: bindModule(),
  optimization: bindOptimization()
}

module.exports = config