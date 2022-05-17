/*
 * @Description: tpl list 指令输出
 * @Author: llgtfoo
 * @Date: 2021-10-14 08:37:59
 * @LastEditTime: 2021-10-14 08:49:32
 * @LastEditors: llgtfoo
 * @FilePath: \ll-tpl-cli-pro\vue\list.js
 */
const Table = require('cli-table2') //表格输出
const chalk = require('chalk') //字体改变
const templateList = require('../templates.json') //模板json
const { log } = require('../plugins/log.js') //日志输出
module.exports = function list() {
    console.log('Available official templates:')
    console.log()
        // Object.keys(templateList).forEach(tpl => {
        //   console.log(
        //     `  ${chalk.yellow('★')
        //     }  ${chalk.blue.bold(templateList[tpl].name)
        //     } + ${templateList[tpl].version
        //     } + ${templateList[tpl].type
        //     } + ${templateList[tpl].description}`)
        // })
    const table = new Table({
            head: ['名称', '版本', '类型', '描述'],
        })
        // eslint-disable-next-line guard-for-in
    for (const key in templateList) {
        table.push(
            [
                `${chalk.yellow.bold(templateList[key].index)}、${chalk.blue.bold(templateList[key].name)} `,
                templateList[key].version,
                templateList[key].type,
                templateList[key].description,
            ]
        )
    }
    console.log(table.toString())
    console.log()
        // console.log(`ll - tpl - cli地址：${ log.info('https://github.com/llgtfoo/ll-tpl-cli.git') } `)
    console.log()
}