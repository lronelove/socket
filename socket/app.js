const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Redis = require('ioredis')

const config = require('./config/index.js') // 配置信息
const createRedisServer = require('./redis/index.js') // 创建redis服务的函数
const SocketHandler = require('./socketHandler/index.js') // 处理socket事件对应的方法
const HttpHandler = require('./httpHandler/index.js') // 处理http请求对应的方法

const redis = createRedisServer(Redis, config.redis.host, config.redis.port) // 创建redis服务

// socket 链接
io.on('connection', (socket) => {
   console.log('socketId:' + socket.id + '已经链接')
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

module.exports = http
