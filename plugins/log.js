/*
 * @Description:日志提示
 * @Author: llgtfoo
 * @Date: 2021-10-13 16:34:47
 * @LastEditTime: 2021-10-13 17:43:20
 * @LastEditors: llgtfoo
 * @FilePath: \ll-tpl-cli-pro\plugins\log.js
 */

const chalk = require('chalk')//字体改变
module.exports.log = {
  info(text) {
    return (chalk.yellowBright.bold(text))
  },
  warning(text) {
    return (chalk.bold.red(text))
  },
  success(text) {
    return (chalk.blue.bold(text))
  },
}