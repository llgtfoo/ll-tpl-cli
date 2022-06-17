#!/usr/bin/env node

/*
 * @Description: tpl create 指令创建模板
 * @Author: llgtfoo
 * @Date: 2021-10-14 08:38:09
 * @LastEditTime: 2021-10-14 17:04:59
 * @LastEditors: llgtfoo
 * @FilePath: \ll-tpl-cli\vue\create.js
 */
const fs = require('fs-extra')
const path = require('path')
const figlet = require('figlet')
const { log } = require('../plugins/log.js') //日志输出
const inquirer = require('inquirer') //问答交互
const chalk = require('chalk') //字体改变
const templateList = require('../templates.json') //模板json
const download = require('../plugins/download.js')
const ora = require('ora') //loading效果
const spawn = require('cross-spawn')


module.exports = function create(name) {
    const cwd = process.cwd()
    const targetDir = path.resolve(cwd, name || '.')
    figlet('Welcome To Use', async function(err, data) {
        if (err) {
            console.dir(log.warning(err))
            return
        }
        console.log(log.info(data))

        if (fs.existsSync(targetDir)) {
            const { action } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
                choices: [
                    { name: 'Overwrite', value: 'overwrite' },
                    { name: 'Cancel', value: false }
                ]
            }])
            if (!action) {
                return
            } else if (action === 'overwrite') {
                console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
                await fs.remove(targetDir)
            }
        }
        inquirer.prompt([{
            type: 'list',
            name: 'template',
            loop: false,
            pageSize: 10,
            message: log.info('请选择项目模板：'),
            choices: function() {
                const done = this.async()
                const options = Object.keys(templateList).map(tpl => {
                    return {
                        key: tpl,
                        name: `${chalk.bold(templateList[tpl].index)
                            }、${chalk.blue.bold(templateList[tpl].name)
                            } + ${chalk.bold(templateList[tpl].version)
                            } + ${chalk.bold(templateList[tpl].type)
                            } + ${chalk.magenta.bold.underline(templateList[tpl].description)}`,
                        value: templateList[tpl],
                        short: `${chalk.bold(templateList[tpl].index)
                            }、${chalk.bold(templateList[tpl].name)
                            } + ${chalk.bold(templateList[tpl].version)
                            } + ${chalk.bold(templateList[tpl].type)
                            } + ${chalk.magenta.bold.underline(templateList[tpl].description)}`,
                    }
                })
                done(null, options)
            },
        }, ]).then(template => {
            download(template, targetDir, (cb) => {
                if (cb) {
                    const snpper = ora((log.info('downloading dependencies...'))).start()
                        //依赖自动下载
                    const child = spawn.sync('npm', ['install'], { stdio: 'inherit', cwd: targetDir })

                    if (!child.error) {

                        snpper.succeed(log.success('downloading dependencies is successful...'))
                        const cwd = "cd " + path.relative(process.cwd(), targetDir)
                        console.log(`$ ${chalk.cyan(cwd)}`)
                        console.log(`$ ${chalk.cyan('npm run serve')}`)

                    } else {

                        snpper.fail(log.warning('downloading dependencies is unsuccessful...'))
                        console.log()
                        console.log(log.warning('please manually download dependency...'))

                    }
                }
            })
        })

    })
}