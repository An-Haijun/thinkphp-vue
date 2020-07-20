const fs = require('fs')
const nodePath = require('path')
const webpack = require('webpack')
const color = require('colors')
const md5 = require('md5')
// const devConfig = require('./webpack.dev')

const stat = fs.stat;

console.log('根路径：', process.env.INIT_CWD)

// const options = process.argv// JSON.parse(process.env.npm_config_argv)
// console.log('cmd 参数', options.original[1])
// const targetPath = options.original[1] // .split('/')

const options = process.argv.splice(2)
const targetPath = options[0]

console.log('目标路径', targetPath)

// const outputPath = '../server/src/views'
const modulePath = '../src/module'

const outputPath = {
  html: `../server/application`,
  src: '../src/views'
}

const moduleFile = {
  html: `${modulePath}/index.html`,
  template: `${modulePath}/index.template.html`,
  js: `${modulePath}/index.js`,
  css: `${modulePath}/index.scss`
}

const fileNamePrefix = targetPath.substring(0, targetPath.lastIndexOf("/"))

const htmlOutputPath = outputPath.html + '/' + fileNamePrefix
const assetsOutputPath = outputPath.src + '/' + fileNamePrefix.replace(/\/view/, '')
const fileName = targetPath.substring(targetPath.lastIndexOf("/") + 1, targetPath.length)
const templateName = fileNamePrefix + '/' + fileName
const layoutName = options[1] || 'basic'
const assetsFileName = `${fileName}.${createUuid()}`

const outputFile = {
  html: `${htmlOutputPath}/${fileName}.html`,
  template: `${htmlOutputPath}/${fileName}.template.html`,
  js: `${assetsOutputPath}/${assetsFileName}.js`,
  css: `${assetsOutputPath}/${assetsFileName}.scss`
}


function wrapPromise(fn) {
  return new Promise((resolve, reject) => {
    fn(resolve, reject)
  })
}

function pathResolve(path) {
  return nodePath.resolve(__dirname, path)
}

function createUuid() {
  // createTimestamp() + 
  const uuid = md5(targetPath)
  const res = uuid.substring(9, 25)
  return res
}

function createTimestamp() {
  return (new Date()) * 1000 / 1000
}

/**
 * 替换 html 模板内容
 * @param {*} htmlData 
 */
function replaceHtml(htmlData) {
  htmlData = htmlData.replace(/#template#/g, templateName)
  htmlData = htmlData.replace(/#layout#/g, layoutName)
  htmlData = htmlData.replace(/#assets#/g, assetsFileName)
  return htmlData
}

/**
 * 替换模板 js  内容
 * @param {*} jsData 
 */
function replaceJs(jsData) {
  jsData = jsData.replace(/#css#/g, assetsFileName)
  return jsData
}

/**
 * 文件是否已存在
 * @param {*} output 
 */
async function exists(output) {
  return await wrapPromise(resolve => {
    //测试某个路径下文件是否存在
    fs.exists(pathResolve(output), function (exists) {
      if (exists) {//存在
        resolve(true)
      } else {//不存在
        resolve(false)
      }
    })
  })
}

/**
 * 创建文件夹
 * @param {*} path 
 */
async function createDir(path) {
  return await wrapPromise(resolve => {
    fs.mkdir(path, { recursive: true }, (err) => {//创建目录
      if (err) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

/**
 * 读取文件内容
 * @param {*} path 
 */
async function readFile(path) {
  return await wrapPromise(resolve => {
    fs.readFile(nodePath.join(__dirname, path), 'utf8', (err, data) => {
      if (err) { resolve(null) }
      resolve(data)
    })
  })
}

/**
 * 创建并写入文件
 * @param {*} path 
 * @param {*} data 
 */
async function writeFile(path, data) {
  return await wrapPromise(resolve => {
    fs.writeFile(nodePath.join(__dirname, path), data, 'utf8', (err) => {
      if (err) return false;
      // console.log('success done');
      resolve(true)
    })
  })
}

/**
 * 是否存在原文件，true: 替换模板文件路径为已存在文件路径
 */
async function isExistsOriginalFile() {
  const isHtmlExists = await exists(outputFile.html)
  moduleFile.html = isHtmlExists ? outputFile.html : moduleFile.html
  const isTemplateExists = await exists(outputFile.template)
  moduleFile.template = isTemplateExists ? outputFile.template : moduleFile.template
  const isJsExists = await exists(outputFile.js)
  moduleFile.js = isJsExists ? outputFile.js : moduleFile.js
  const isCssExists = await exists(outputFile.css)
  moduleFile.css = isCssExists ? outputFile.css : moduleFile.css
}

/**
 * 数据读取并生成文件
 */
async function generateFile() {
  await isExistsOriginalFile()
  let htmlPath = moduleFile.html
  const template = moduleFile.template
  const js = moduleFile.js
  const css = moduleFile.css
  
  const htmlData = await readFile(htmlPath)
  htmlData && await writeFile(outputFile.html, replaceHtml(htmlData))
  const templateData = await readFile(template)
  await writeFile(outputFile.template, templateData)
  const jsData = await readFile(js)
  await writeFile(outputFile.js, replaceJs(jsData))
  const cssData = await readFile(css)
  await writeFile(outputFile.css, cssData)

  return true
}

/**
 * 初始化
 */
async function initialize() {
  const resHtmlOutputPath = pathResolve(`${htmlOutputPath}`)
  const resAssetsOutputPath = pathResolve(`${assetsOutputPath}`)

  const isHtmlExists = await exists(resHtmlOutputPath)
  if (!isHtmlExists) {
    await createDir(resHtmlOutputPath)
  }
  const isAssetsExists = await exists(resAssetsOutputPath)
  if (!isAssetsExists) {
    await createDir(resAssetsOutputPath)
  }
  await generateFile()
  
  console.log('√ Generated Successful!'.green)
}

initialize()