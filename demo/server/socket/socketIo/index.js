// 初始化监听函数
class NodeSocket {
  constructor (io, redis, socketHandler) {
    this.io = io
    this.redis = redis
    this.socketHandler = socketHandler
  }

  initSocketEvent () {
    this.io.on( 'connection', socket => {
      // socket链接，把token和对应的socket会话一一对应，存储在redis
      socket.on('join', (token) => {
        this.socketHandler.join(this.redis, token, socket, this.io)
      })
    
      // 发送消息给指定某个人
      socket.on('message', async data => {
        this.socketHandler.message(data, this.redis, this.io)
      })
    
      // 断掉链接
      socket.on('disconnect', () => {
        this.socketHandler.disconnect()
      })
    })
  }
}

module.exports = NodeSocket

