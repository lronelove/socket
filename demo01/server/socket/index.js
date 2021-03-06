const cluster = require('cluster');
const OS = require('os');
const chalk = require('chalk');
const app = require('./app.js');

// 获取CPU数量
const nums = OS.cpus().length;

// 当前如果是主线程
if (cluster.isMaster) {
  // 循环 fork 任务
  for (let i = 0; i < nums; i++) {
    const worker = cluster.fork();

    worker.on('online', () => {
      worker.send('worker is online');
      console.log(chalk.cyanBright(`${worker.id } worker is online`));
    });
  }
 
  // 打印当前主线程
  console.log(chalk.green(`主线程运行在${process.pid}`));
  // 监听 exit 事件
  cluster.on('exit', (worker, code, signal) => {
    console.log(chalk.redBright(`工作线程${worker.process.pid}已退出`));
  })
  cluster.on('message', (worker, msg, handle) => {
    console.log(handle);
    console.log(chalk.red(worker.id + 'worker id'), msg);
  })
// 当前如果是工作线程
} else {
  app.listen(3000);
  // 打印当前子线程
  console.log(chalk.red(`worker ${process.pid} started`));
  // process.send({ cmd: '1', data: 'Hello Master' })
  process.on('message', (msg) => {
    console.log(chalk.cyanBright('Message from Master ' + msg));
    process.send('Message from Master ' + msg);
  })
}
