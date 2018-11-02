const masterLogger = require('./../log/index.js')

class HttpHandler {
    // 测试的方法，可以推送socket服务，而且也可以发送ajax请求
    static async test(redis, io, req, res) {
        let socketId = await redis.get('lronelove').then(res => {
            return res
        })
        let target = io.sockets.connected[socketId]

        if (target) {
            target.emit('message', 'I am from ajax')
            masterLogger.info('receive some message from message center')
        }
        res.send({
            code: 0,
            data: socketId
        })
    }

    // 消息中心推送数据给我的接口
    static async reiceveMessage(req, res, redis, io) {
        let {
            target,
            data
        } = req.body
        const users = target.split(',') // 获取用户列表

        for (let i = 0, len = users.length; i < len; i++) {
            let socketId = await redis.get(users[i].trim()).then(res => {
                return res
            })
            let target = io.sockets.connected[socketId]

            if (target) {
                target.emit('message', data)
                masterLogger.info('receive some message from message center')
            }

        }

        res.send({
            done: 'has send these message',
            target,
            data
        })
    }
}

module.exports = HttpHandler