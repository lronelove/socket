// 转么用于处理socket事件的对象
const socketHandler = {
  // socket链接，把token和对应的socket会话一一对应，存储在redis
  join (redis, token, socket) {
    redis.set(token, socket.id)
    console.log(token + 'register' + socket.id)
  },

  // 发送消息给指定某个人
  async message (data, redis, io) {
    let from = data.from // 消息的来源token
    let to = data.to // 消息的接收者的token
    let msg = data.msg // 发送的消息

    // 在redis里面查询相应的socketId
    let socketId = await redis.get(to).then(res => {
      return res
    })
    // 通过socketId找到对应的socket会话
    let target = io.sockets.connected[socketId]
    
    if (target) {
      console.log('private message to:' + to)
     //  target.emit('message', `port is 3002 from ${from} send to ${to}, message is ${msg}`) socket.id
      target.emit('message', socketId + ' from:' + from + 'msg:' + msg) // 发送消息
    }
  },

  // 断掉链接
  async disconnect () {
    console.log('bye bye!')
  }

}

module.exports = socketHandler