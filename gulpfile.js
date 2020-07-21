const { src, dest, series, parallel, watch } = require('gulp')
const del = require('del')
const nodePath = require('path')
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
// 使用 webpack 打包编译文件
const gulpWebpack = require('webpack-stream')
// 多文件输出
const named = require('vinyl-named')
// String.color
const colors = require('colors')
const fs = require('fs')
const rev = require('gulp-rev')

const { outputPath } = require('./build/base')
const { pathResolve, bindEntry } = require('./build/utils')

const env = process.env.NODE_ENV
const isProduction = env === 'production'
const targetPath = `${isProduction ? outputPath.prod : outputPath.dev}`
const webpackConfig = require(isProduction ? './build/webpack.prod' : './build/webpack.dev')

function cleanRoot(cb) {
  del(targetPath + '/**')
  cb()
}

async function handleJs(cb) {
  const { lists } = bindEntry()

  if (!lists || (lists && lists.length === 0)) {
    console.log('\n Warning：'.bgRed, 'There is no match, next... \n')
    return
  }
  await src(lists, { allowEmpty: true })
    .pipe(named())
    .pipe(gulpWebpack(webpackConfig, webpack, function (err, stats) {
      /* Use stats to do more things if needed */
      // const startTime = stats.startTime,
      // endTime = stats.endTime;
      // let finishedTime = endTime - startTime
      if (err) {
        console.log('X — Failed!'.red.bold)
        return
      }
      console.log('√ — Successful!'.green.bold)
    }))
    .pipe(dest(targetPath))
}

/**
 * 
 * @param {watcher: 'watch 进程', path: '文件路径'} options 
 */
function handleUnWatch(options = {}) {
  const watcher = options.watcher,
    path = options.path
  const splitPaths = path.split('\\')
  const item = splitPaths[splitPaths.length - 1].replace(/.js/, '')
  const delPath = `${targetPath}/**/${item}*.js*`
  watcher.unwatch(path)
  del(delPath)
}

const bindReloadJavascript = series(handleJs)

function watchJs(cb) {
  let watcher = watch('./src/views/**/*.*', { delay: 300 })
  watcher.on('change', function (path, stats) {
    console.log(`File ${path} changed`)
    if (path.indexOf('views') != -1) {
      bindReloadJavascript()
    }
  })

  let startComplier = true
  let timeout1 = null, timeout2 = null
  watcher.on('add', function (path, stats) {
    console.log(`File ${path} added`)
    if (path.indexOf('views') != -1) {
      watcher.add(path)
      bindReloadJavascript()
      // startComplier = false
      // timeout1 = setTimeout(() => {
      //   startComplier = true
      //   clearTimeout(timeout1)
      // }, 800);
      // timeout2 = setTimeout(() => {
      //   if (startComplier) {
      //     watcher.add(path)
      //     bindReloadJavascript()    
      //   }
      //   startComplier = false
      //   clearTimeout(timeout2)
      // }, 1000);
    }
  })

  watcher.on('unlink', function (path, stats) {
    console.log(`File ${path} deleted`);
    if (path.indexOf('views') !== -1 && path.indexOf('.js') != -1) {
      handleUnWatch({
        watcher, path
      })
    }
  })
  const watcherSrc = watch('./src/**/*.*', { delay: 300 })
  watcherSrc.on('change', function (path, stats) {
    if (path.indexOf('views') === -1) {
      console.log(`File(src) ${path} changed`)
      bindReloadJavascript()
    }
  })
}

function replaceProdEnv(cb) {
  const target = 'config/global'
  fs.readFile(path.join(__dirname, `./server/${target}.php`), 'utf8', function (err, data) {
    let _data = data
    let replaceData = _data.replace(/\$env\s*=\s*\'[a-zA-Z0-9]*\'/g, `$env = 'prod'`)
    console.log('Done!')
    const timestamp = (new Date()) * 1000 / 1000
    replaceData = replaceData.replace(/\$t\s*=\s*\'[a-zA-Z0-9]*\'/g, `$t = '${timestamp}'`)
    fs.writeFile(path.join(__dirname, `./server/${target}.php`), replaceData, 'utf8', (err) => {
      if (err) throw err;
      console.log('success done');
      cb()
    })
  })
}

function replaceDevEnv(cb) {
  const target = 'config/global'
  fs.readFile(path.join(__dirname, `./server/${target}.php`), 'utf8', function (err, data) {
    let _data = data
    let replaceData = _data.replace(/\$env\s*=\s*\'[a-zA-Z0-9]*\'/g, `$env = 'dev'`)
    console.log('Done!')

    fs.writeFile(path.join(__dirname, `./server/${target}.php`), replaceData, 'utf8', (err) => {
      if (err) throw err;
      console.log('success done');
      cb()
    })
  })
}

exports.build = series(cleanRoot, handleJs, replaceProdEnv)

exports.dev = series(cleanRoot, handleJs, replaceDevEnv, watchJs)