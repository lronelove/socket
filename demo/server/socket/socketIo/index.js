const io = require('./io.js');
const socketHandler = require('./socketHandler.js');
const redis = require('./../redis/index.js');

// 初始化监听函数
const initSocketEvent = () => {
  io.on( 'connection', socket => {
    // socket链接，把token和对应的socket会话一一对应，存储在redis
    socket.on('join', (token) => {
      socketHandler.join(redis, token, socket, io);
    });
  
    // 发送消息给指定某个人
    socket.on('message', async data => {
      socketHandler.message(data, redis, io);
    });
  
    // 断掉链接
    socket.on('disconnect', () => {
      socketHandler.disconnect();
    });
  });
}

module.exports = initSocketEvent;

