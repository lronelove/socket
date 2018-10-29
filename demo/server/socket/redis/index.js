const Redis = require('ioredis')
const config = require('./../config/index.js')
const redisConfig = config.redis

// 开启redis

class NodeRedis {
  constructor (host, port, Redis) {
    this.host = host
    this.port = port
    this.Redis = Redis
  }

  // 创建redis服务
  initRedis () {
    const redis = new this.Redis({
      host : this.host,//安装好的redis服务器地址
      port : this.port,　//端口
      prefix : 'sam:',//存诸前缀
      db: 0
    })

    return redis
  }
}

const nodeRedis = new NodeRedis(redisConfig.host, redisConfig.port, Redis)
module.exports = nodeRedis