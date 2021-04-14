#!/usr/bin/env node
/*
 * @Descripttion: ''
 * @Author: lilong(lilong@hztianque.com)
 * @Date: 2020-12-02 16:11:46
 * @LastEditTime: 2020-12-04 09:02:43
 */

const { Command } = require('commander')//输入命令处理器
const program = new Command()
const inquirer = require('inquirer')//问答交互
const Table = require('cli-table2')//表格输出
const clear = require('clear')//清屏
const ora = require('ora')//loading效果
const chalk = require('chalk')//字体改变
// const fs = require('fs')
const spawn = require('cross-spawn')
const figlet = require('figlet')
const { log } = require('./plugins/log.js')//日志输出
const download = require('./plugins/download.js')
// const { success } = require('log-symbols')//图标
const templateList = require('./template.json')//模板json
program
  .version(require('./package.json').version)
clear()

program
  .command('create <templateName>')
  .description('初始化项目模板...')
  .action((name) => {
    figlet('Welcome To Use', function (err, data) {
      if (err) {
        console.dir(log.warning(err))
        return
      }
      console.log(log.info(data))
      inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: log.info('请选择项目模板：'),
          choices: async function () {
            const done = this.async()
            const options = Object.values(templateList).map(v => {
              return {
                name: `${v.use}(${v.name})[${v.version}](${chalk.magenta.bold.underline(v.description)})`,
                value: v,
              }
            })
            done(null, options)
          },
        },
      ]).then(async answers => {
        await download(answers.template.downloadZip, name, (data) => {
          if (data) {
            const snpper = ora((log.info('正在下载依赖...'))).start()
            //依赖自动下载
            const child = spawn.sync('npm', ['install'], { stdio: 'inherit', cwd: `./${name}` })
            if (!child.error) {
              snpper.succeed(log.success('依赖下载成功！'))
              const table = new Table()
              // table.push(['-------------------------------------'])
              table.push([log.info(`cd ${name}`)])
              table.push([log.info('npm run serve')])
              // table.push(['===================================='])
              console.log(table.toString())
            } else {
              snpper.fail(log.warning('依赖自动下载失败！'))
              console.log(log.warning('请手动下载依赖...'))
            }
          }
        })
      })
    })
  })

program
  .command('list')
  .description('可用模板列表...')
  .action(() => {
    const table = new Table({
      head: ['模板名称', '版本', '模板描述', '描述'],
    })
    // eslint-disable-next-line guard-for-in
    for (const key in templateList) {
      table.push(
        [templateList[key].name, templateList[key].version, templateList[key].use, templateList[key].description]
      )
    }
    console.log(table.toString())
    console.log(`
              `)
    console.log(`ll-tpl-cli地址：${log.info('https://github.com/llgtfoo/ll-tpl-cli.git')}`)
  })

program.parse(process.argv)