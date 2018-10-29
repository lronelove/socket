let app = require('koa')()
, logger = require('koa-logger')
, json = require('koa-json')
, views = require('koa-views')
, onerror = require('koa-onerror')

let index = require('./routes/index')
let users = require('./routes/users')

const NodeSocket = require('./socketIo/index.js') // 封装socket服务的NodeSocket的类
const IO = require('koa-socket')
const io = new IO() // socketIo 插件
const socketHandler = require('./socketIo/socketHandler.js') // 有关socket的一些方法
const nodeRedis = require('./redis/index.js') // 封装的redis
const redis = nodeRedis.initRedis() // 初始化redis服务

io.attach(app) // 把socket赋值给app的一个属性
const nodeSocket = new NodeSocket(app._io, redis, socketHandler) // socket实例

nodeSocket.initSocketEvent() // 添加socket的事件

// error handler
onerror(app)

// global middlewares
app.use(views('views', {
root: __dirname + '/views',
default: 'jade'
}))
app.use(require('koa-bodyparser')())
app.use(json())
app.use(logger())

app.use(function *(next){
var start = new Date
yield next
var ms = new Date - start
console.log('%s %s - %s', this.method, this.url, ms)
})

app.use(require('koa-static')(__dirname + '/public'))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

// 下面是socket的部分操作
// io.attach( app )

// app._io.on( 'connection', socket => {
//   // socket链接，把token和对应的socket会话一一对应，存储在redis
//   socket.on('join', (token) => {
//     socketHandler.join(redis, token, socket)
//   })

//   // 发送消息给指定某个人
//   socket.on('message', async data => {
//     socketHandler.message(data, redis, app)
//   })

//   // 断掉链接
//   socket.on('disconnect', () => {
//     socketHandler.disconnect()
//   })
// })

// routes definition
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// app.listen( process.env.PORT || 3001 )

module.exports = app
