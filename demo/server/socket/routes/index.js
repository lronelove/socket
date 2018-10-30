var router = require('koa-router')()

router.get('/', async (ctx) => {
  ctx.body = 'hello world'
})

module.exports = router
