const genericPool = require("generic-pool")
const Redis = require('ioredis')
const config = require('./../config/index.js') // 配置

// genericPool的factory配置
const factory = {
	create () { // 创建redis服务器
		return new Redis({
			host: config.redis.host,
			port: config.redis.port,
			prefix: 'sam:',
			db: 0
		}) 
	},
	destroy (client) { // 关闭redis服务器
		client.quit()
	}
}

// genericPool的options配置
const options = {
	max: 100,
	min: 5
}
const myPool = genericPool.createPool(factory, options) // 创建pool

// 创建包含generic-pool的redis服务
const createRedisServer = () => {
	const redis = {
		// set 方法
		set (key, value) {
			const resourcePromise = myPool.acquire()

			resourcePromise.then(client => {
				client.set(key, value) // 进行存储
				myPool.release(client) // 释放client
			})
		},

		// get 方法
	   get (key) {
			const resourcePromise = myPool.acquire()

			return resourcePromise.then(async (client) => {
				let data = await client.get(key).then(res => {
					return res
				})
				myPool.release(client)  // 释放client

				return data
			})
		}
	}

	return redis
}

module.exports = createRedisServer