const log4js = require('log4js')
const cluster = require('cluster')

// log4js相关的配置
log4js.configure({
  appenders: {
   	cheese: {
   		type: 'dateFile', // 生成日期种类的文件
    	filename: __dirname + '/logFile/lronelove', // 您要写入日志文件的路径
    	alwaysIncludePattern: true, //（默认为false） - 将模式包含在当前日志文件的名称以及备份中
   		pattern: '-yyyy-MM-dd-hh.log', //（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
    	encoding : 'utf-8', // default "utf-8"，文件的编码
    	category: 'log_date',
   	}
  },
  categories: { default: { appenders: ['cheese'], level: 'trace' } }
})
const logger = log4js.getLogger('cheese')
const isMaster = () => { // 判断是不是主进程
  return cluster.isMaster
}

// 只在主进程去打印信息，稍微做一些修饰
const masterLogger = {
  trace (info) { 
    if (isMaster) logger.trace(info) 
  },
  debug (info) {
    if (isMaster) logger.debug(info) 
  },
  info (info) {
    if (isMaster) logger.info(info) 
  },
  warn (info) {
    if (isMaster) logger.warn(info)
  },
  error (info) {
    if (isMaster) logger.error(info)
  },
  fatal (info) {
    if (isMaster) logger.fatal(info)
  }
}

/* 
// 下面是使用的方法
masterLogger.trace('Entering cheese testing')
masterLogger.debug('Got cheese.')
masterLogger.info('Cheese is Comté.')
masterLogger.warn('Cheese is quite smelly.')
masterLogger.error('Cheese is too ripe!')
masterLogger.fatal('Cheese was breeding ground for listeria.')
*/

module.exports = masterLogger