var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

const Redis = require('ioredis');  
const IO = require( 'koa-socket' );
const io = new IO();

var index = require('./routes/index');
var users = require('./routes/users');

// 开启redis
const redis=new Redis({
  host : '127.0.0.1',//安装好的redis服务器地址
  port : 6379,　//端口
  prefix : 'sam:',//存诸前缀
  db: 0
});

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// 下面是socket的部分操作
io.attach( app );

app._io.on( 'connection', socket => {
  console.log('socketId:' + socket.id + '已经链接');
  // app._io.sockets.socket(socket.id).emit('message','surprise');
   socket.on('join', (token) => {
     redis.set(token, socket.id);
     console.log(token + 'register' + socket.id);
   });

   socket.on('message', async data => {
     let from = data.from;
     let to = data.to;
     let msg = data.msg
     let socketId = await redis.get(to).then(res => {
       return res
     });
     let target = app._io.sockets.connected[socketId]

     if (target) {
       console.log('private message to:' + to);
      //  target.emit('message', `port is 3002 from ${from} send to ${to}, message is ${msg}`); socket.id
       target.emit('message', socketId + 'from:' + from);
     }
   });
})
// app.listen( process.env.PORT || 3001 );

module.exports = app;
