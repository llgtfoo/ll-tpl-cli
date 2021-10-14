#!/usr/bin/env node
/*
 * @Descripttion: '入口文件'
 * @Author: lilong(lilong@hztianque.com)
 * @Date: 2020-12-02 16:11:46
 * @LastEditTime: 2021-10-14 16:45:56
 */

const { Command } = require('commander')//输入命令处理器
const program = new Command()
const clear = require('clear')//清屏
program
  .version(require('./package.json').version)
clear()

program
  .command('create <templateName>')
  .description('初始化项目模板...')
  .action((name) => {
    require('./vue/create.js')(name)
  })

program
  .command('list')
  .description('可用模板列表...')
  .action(() => {
    require('./vue/list.js')()
  })

program.parse(process.argv)