const masterLogger = require('./../log/index.js')

class SocketHandler {
    // 用户加入的时候触发的事件
    static join(redis, userId, socket) {
        redis.set('userId:' + userId, socket.id)
        console.log(userId + ' register ' + socket.id)
        masterLogger.info(userId + ' register ' + socket.id)
    }

    // 监听客户端发给某人的消息的事件
    static async message(data, redis, io) {
        let {
            from,
            to,
            msg
        } = data
        let socketId = await redis.get('userId:' + to).then(res => {
            return res
        })
        let target = io.sockets.connected[socketId]
        
        if (target) {
            console.log('private message to:' + to)
            masterLogger.info('private message to:' + to)
            target.emit('message', socketId + 'from:' + from)
        }
    }
}
module.exports = SocketHandler