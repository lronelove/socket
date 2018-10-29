var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

// const Redis = require('ioredis');  
const IO = require( 'koa-socket' );
const io = new IO();

var index = require('./routes/index');
var users = require('./routes/users');

// 开启redis
// const redis=new Redis({
//   host : '127.0.0.1',//安装好的redis服务器地址
//   port : 6379,　//端口
//   prefix : 'sam:',//存诸前缀
//   db: 0
// });

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
io.on('message', (ctx, data) => {
   console.log('hello world', data);
});
let socketList = {};
var proxyServer = require('http-proxy');
var port = 80;
var servers = [
  {
    host: "localhost",
    port: 3001
  },
  {
    host: "localhost",
    port: 3002
  }
];


app._io.on( 'connection', socket => {
    let item = servers.shift()
    var target = item.host + item.port
    servers.push(item)
    var proxy = proxyServer.createProxyServer({
    target: target
    })

    proxy.on('error', (err) => {
      console.log('err' + err)
  })

    // proxy.listen(80)
  
  //  socket.on('join', (userId) => {
  //    socketList[userId] = socket
  //  });

  //  socket.on('message', async data => {
  //    let from = data.from;
  //    let to = data.to;
  //    let msg = data.msg
  //    let target = socketList[to];

  //    if (target) {
  //      console.log('private message to:' + to);
  //      target.emit('message', `port is 3000 from ${from} send to ${to}, message is ${msg}`);
  //    }
  //  });
})
// app.listen( process.env.PORT || 3001 );

module.exports = app;
