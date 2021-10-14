/*
 * @Description: github下载模板
 * @Author: llgtfoo
 * @Date: 2021-10-14 10:58:10
 * @LastEditTime: 2021-10-14 16:11:00
 * @LastEditors: llgtfoo
 * @FilePath: \ll-tpl-cli-pro\plugins\download.js
 */
const fs = require('fs-extra')
const inquirer = require('inquirer')//问答交互
const downloadTo = require('download-git-repo')//git clone 代码
const { log } = require('./log.js')//日志输出
const ora = require('ora')//loading效果
const handlebars = require('handlebars')//模板处理器
const spawn = require('cross-spawn')
const path = require('path')
const chalk = require('chalk')//字体改变

module.exports = function download({ template }, targetDir, callback) {
    const snpper = ora((log.info('Initializing the Create project template...')))
    console.log(`
    `)
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
        console.log(`Creating project in ${chalk.cyan(targetDir)}.`)
        snpper.start()
        downloadTo(template.downloadUrl, targetDir, function (err) {
            if (err) {
                console.log(err)
                snpper.fail(log.warning('Failed to create the project template...'))
                console.log()
                callback(false)
                return
            } else {
                try {
                    const cwd = process.cwd()
                    const obj = { ...answers, name: path.relative(cwd, targetDir) }
                    const fileContent = fs.readFileSync(`${targetDir}/package.json`, 'utf8')
                    const fileResult = handlebars.compile(fileContent)(obj)
                    const result = fs.writeFileSync(`${targetDir}/package.json`, fileResult)
                    if (!result) {
                        snpper.succeed(log.success('The project template is created successfully!'))
                        spawn.sync('git', ['init'], { stdio: 'inherit', cwd: targetDir })
                        callback(true)
                    } else {
                        // fs.remove(targetDir)
                        snpper.fail(log.warning('Failed to create the project template...'))
                        callback(false)
                    }
                } catch {
                    fs.remove(targetDir)
                    snpper.fail(log.warning('Failed to create the project template...'))
                    callback(false)
                }
            }
        })
    })
}