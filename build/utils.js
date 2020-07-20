const fs = require('fs')
const glob = require('glob')
const path = require('path')

/* 开启多进程编译 happypack 、 webpack-parallel-uglify-plugin*/
const HappyPack = require('happypack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
/* 抽离压缩 css */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
/* 编译解析 Vue 单文件组件 */
const VueLoaderPlugin = require('vue-loader/lib/plugin')
/* 提取并配置html文件 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
/* 转译ES6 */
const TerserPlugin = require("terser-webpack-plugin")

const ProgressBarPlugin = require('progress-bar-webpack-plugin')


const { globalScss } = require('./base')

const env = process.env.NODE_ENV

function pathResolve(_path = '') {
  return path.resolve(__dirname, _path)
}

/**
 * 控制台打印
 * @param {打印标题} name 
 */
function consoleTip(name = '') {
  env === 'production' && console.log('-￥-'.repeat(20))
  console.log('-'.repeat(30))
  console.log(`【${name}】：开始构建 - ${env === 'production' ? '生产部署' : '本地开发'}`)
  console.log('-'.repeat(30))
  env === 'production' && console.log('-￥-'.repeat(20))
}


function bindEntry() {
  const globPath = pathResolve(`../src/views/**/*.js`)
  const files = glob.sync(globPath)
  let fileMaps = {}
  let number = 0
  let lists = []
  files.forEach(function (key) {
    // 'D:/DeveloperTools/php/phpStudy/install/PHPTutorial/WWW/experimental/tp5/src/views/index/index.js'
    if (key.indexOf(`/src/`) != -1) {
      number++
      // let entryKey = env === 'production' ? `${number}` : key.split(path + '/')[1].replace(/.js/g, '').replace(/\//g, '-')
      let entryKey = key.split('/src/')[1].replace(/.js/g, '').replace(/\//g, '-')
      fileMaps[entryKey] = pathResolve(key)
      lists.push(pathResolve(key))
    }
  })

  return {
    data: fileMaps,
    lists: lists,
    number: number
  }
}

function bindPlugins() {
  let publicPlugins = [
    // new CleanWebpackPlugin(),
    new HappyPack({
      id: 'js', // id与上面对应
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }]
    }),
    new VueLoaderPlugin(),
    new ProgressBarPlugin({ format: ('\r\r Build：').bgGreen + ' [:bar] ' + (':percent').green.bold + ' (:elapsed seconds)', clear: false, width: 60 })
  ]
  if (env === 'production') {
    publicPlugins.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: false,
            drop_debugger: true,
            pure_funcs: ["console.log"]
          }
        },
      })
    )
  }

  return publicPlugins
}

function bindModule() {
  let globalScssList = []
  for (let item of globalScss) {
    globalScssList.push(pathResolve(item))
  }
  const parseJs = {
    test: /\.js$/,
    use: 'Happypack/loader?id=js'
  }
  const parseCss = {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      'style-loader',
      'css-loader',
    ]
  }
  const parseScss = {
    test: /\.scss$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'sass-loader',
      { // 配置全局 scss 变量
        loader: 'sass-resources-loader',
        options: {
          resources: globalScssList
        }
      }
    ]
  }
  const parseImage = {
    test: /.(png|jpg|gif|jpeg|svg)$/,
    use: [{
      loader: 'file-loader',
      // options: {
      //   name: `${assetsPath}/img/[name]_[hash:8].[ext]`
      // }
    }]
  }
  const parseVue = {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    }
  }
  const parseFile = {
    test: /.(woff|woff2|eot|ttf|otf)$/,
    use: [{
      loader: 'file-loader',
      // options: {
      //   name: `${assetsPath}/font/[name]_[hash:8].[ext]`
      // }
    }]
  }
  return {
    rules: [parseJs, parseCss, parseScss, parseImage, parseVue, parseFile]
  }
}

function bindOptimization() {
  const commons = {
    chunks: 'all',
    test: (module) => {
      return /common|layout/.test(module.context);
    },
    name: 'commons',
    // minSize: 3, //大于0个字节
    minChunks: 1 //抽离公共代码时，这个代码块最小被引用的次数
  }
  const vendor = {
    priority: 1, //权重
    chunks: 'all',
    test: (module) => {
      return /tools|components/.test(module.context);
    },
    name: 'vendor',
    // minSize: 3, //大于0个字节
    minChunks: 1 //抽离公共代码时，这个代码块最小被引用的次数
  }
  return {
    // 分割代码块
    splitChunks: {
      //公用模块抽离
      cacheGroups: { commons, vendor }
    },
    // 开启多线程编译
    minimizer: [
      new ParallelUglifyPlugin({ // 多进程压缩
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      })
    ]
  }
}

module.exports = {
  pathResolve,
  consoleTip,
  bindEntry,
  bindPlugins,
  bindModule,
  bindOptimization,
}
