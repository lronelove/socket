const masterLogger = require('./../log/index.js')

class SocketHandler {
    // 用户加入的时候触发的事件
    static join(redis, token, socket) {
        redis.set(token, socket.id)
        console.log(token + ' register ' + socket.id)
        masterLogger.info(token + ' register ' + socket.id)
    }

    // 监听客户端发给某人的消息的事件
    static async message(data, redis, io) {
        let { from, to, msg } = data
        let socketId = await redis.get(to).then(res => {
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