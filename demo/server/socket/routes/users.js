const app = require('./../app.js')
var router = require('koa-router')();
// const socketHandler = require('./../socket/socketHandler.js');
const redis = require('./../redis/index.js');

router.prefix('/users');

router.post('/sendMessage', function *(next) {
  let { token, msg } = this.request.header;
  let data = {
    from: 'service',
    to: token,
    msg: msg
  }
  // socketHandler.message(data, redis, app)
  this.body = { token, msg };
});

router.get('/bar', function *(next) {
  this.body = 'this is a users/bar response!';
});

module.exports = router;
