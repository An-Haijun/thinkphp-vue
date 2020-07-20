const context = '../'

const outputPath = {
  dev: 'server/public/assets/dev',
  prod: 'server/public/assets/bundle'
}

// 全局 SCSS 变量文件
const globalScss = ['../src/assets/global.scss']

module.exports = {
  context,
  outputPath,
  globalScss
}