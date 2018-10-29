const Redis = require('ioredis');
const config = require('./../config/index.js');
const redisConfig = config.redis;

// 开启redis
const redis = new Redis({
  host : redisConfig.host,//安装好的redis服务器地址
  port : redisConfig.port,　//端口
  prefix : 'sam:',//存诸前缀
  db: 0
});

module.exports = redis;