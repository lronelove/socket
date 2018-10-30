const createRedisServer = (Redis, host, port) => {
	const redis = new Redis({
  		host : host,//安装好的redis服务器地址
  		port : port,　//端口
  		prefix : 'sam:',//存诸前缀
  		db: 0
	})

	return redis
}

module.exports = createRedisServer