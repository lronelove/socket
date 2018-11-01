class HttpHandler {
	// 测试的方法，可以推送socket服务，而且也可以发送ajax请求
	static async test (redis, io, req, res) {
		let socketId = await redis.get('lronelove').then(res => {
      return res
  	})
  	let target = io.sockets.connected[socketId]
  		
  	if (target) {
    	target.emit('message', 'I am from ajax')
  	}
  	res.send({
    	code: 0,
    	data: socketId
  	})
	}
}

module.exports = HttpHandler