const app = require('express')()
const bodyParser = require('body-parser')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const config = require('./config/index.js') // 配置信息
const createRedisServer = require('./redis/index.js') // 创建redis服务的函数
const SocketHandler = require('./socketHandler/index.js') // 处理socket事件的对象
const HttpHandler = require('./httpHandler/index.js') // 处理http请求的对象
const masterLogger = require('./log/index.js') // 在主进程打印的对象

const redis = createRedisServer() // 创建redis服务
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// socket 链接
io.on('connection', (socket) => {
   console.log('socketId:' + socket.id + '已经链接')
   masterLogger.info('socketId:' + socket.id + '已经链接')
   socket.on('join', (token) => {
     SocketHandler.join(redis, token, socket)
   })

   socket.on('message', async data => {
     SocketHandler.message(data, redis, io) 
   })
})

// http 接口
app.get('/test', async (req, res) => {
  HttpHandler.test(redis, io, req, res)
})

app.post('/http/reiceveMessage', urlencodedParser, async (req, res) => {
	HttpHandler.reiceveMessage(req, res, redis, io)
})

module.exports = http
