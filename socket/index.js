// 这里主要是做node cluster集群的处理
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const http = require('./app.js')
const masterLogger = require('./log/index.js')

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`)
  masterLogger.trace(`主进程 ${process.pid} 正在运行`)

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`)
    masterLogger.trace(`工作进程 ${worker.process.pid} 已退出`)
  })
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 socket 服务器。
  http.listen(3001, () => {
    masterLogger.trace('server is running at 3001')
    console.log('server is running at 3001')
  }) 

  masterLogger.trace(`工作进程 ${process.pid} 已启动`)
  console.log(`工作进程 ${process.pid} 已启动`)
}