var router = require('koa-router')()

router.get('/pushMessage', async (ctx) => {
  ctx.body = 'hello world'
})

module.exports = router
