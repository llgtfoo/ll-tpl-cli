/*
 * @Descripttion: '日志输出控制'
 * @Author: lilong(lilong@hztianque.com)
 * @Date: 2020-12-02 16:12:21
 * @LastEditTime: 2020-12-02 17:33:19
 */
const chalk = require('chalk')//字体改变
module.exports.log = {
  info(text) {
    return (chalk.yellowBright.underline(text))
  },
  warning(text) {
    return (chalk.bold.red.underline(text))
  },
  success(text) {
    return (chalk.blue.bold.underline(text))
  },
}