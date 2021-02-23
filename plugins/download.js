/*
 * @Descripttion: '下载模板'
 * @Author: lilong(lilong@hztianque.com)
 * @Date: 2020-12-02 17:34:52
 * @LastEditTime: 2020-12-03 20:22:46
 */
const inquirer = require('inquirer')//问答交互
const downloadTo = require('download-git-repo')//git clone 代码
const { log } = require('./log.js')//日志输出
const ora = require('ora')//loading效果
const fs = require('fs')
const handlebars = require('handlebars')//模板处理器
const spawn = require('cross-spawn')

/**
 * @name: 模板下载(download)
 * @param {url:下载url,dir:文件夹,callback：回调}
 * @return: callback：回调(成功true,失败：false)
 */
module.exports = download = (url, dir, callback) => {
  //删除下载的模板
  deleteFolder = async function (path) {
    let files = []
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path)
      files.forEach(function (file) {
        const curPath = `${path}/${file}`
        if (fs.statSync(curPath).isDirectory()) { // recurse
          deleteFolder(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }
  const snpper = ora((log.info('正在创建模板...'))).start()
  try {
    setTimeout(() => {
      if (fs.existsSync(dir)) {
        snpper.fail(log.warning('项目名称已存在,模板创建失败...'))
        callback(false)
        return
      }
      snpper.stop()
      inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: '请输入项目描述：',
        }, {
          type: 'input',
          name: 'author',
          message: '请输入项目作者：',
        },
      ]).then(answers => {
        snpper.start()
        console.log(answers, url, dir)
        downloadTo(url, dir,
          function (err) {
            if (err) {
              console.log(err)
              snpper.fail(log.warning('模板创建失败...'))
              callback(false)
              return
            } else {
              try {
                const obj = { ...answers, name: dir }
                const fileContent = fs.readFileSync(`${dir}/package.json`, 'utf8')
                const fileResult = handlebars.compile(fileContent)(obj)
                const result = fs.writeFileSync(`${dir}/package.json`, fileResult)
                if (!result) {
                  snpper.succeed(log.success('模板创建成功!!!'))
                  spawn.sync('git', ['init'], { stdio: 'inherit', cwd: `./${dir}` })
                  callback(true)
                } else {
                  const path = `${dir}`
                  deleteFolder(path)
                  snpper.fail(log.warning('模板创建失败...'))
                  callback(false)
                }
              } catch (error) {
                const path = `${dir}`
                deleteFolder(path)
                snpper.fail(log.warning('模板创建失败...'))
                callback(false)
              }
            }
          })
      })
    }, 2000)
  } catch (error) {
    const path = `${dir}`
    deleteFolder(path)
    snpper.fail(log.warning('模板创建失败...'))
    callback(false)
  }
}