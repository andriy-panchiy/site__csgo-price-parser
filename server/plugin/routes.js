const schema = require('./schema.js')

async function routes (fastify, option, done) {
  const fm = fastify.mongo
  const fmdb = fm.db
  const sites = fmdb.collection('test_db')
  const settings = fmdb.collection('settings')

  fastify.get('/', async (req, res) => {
    return { hello: 'world' }
  })

  // setInterval(() => {
  //   const Bot = new Parser()
  //   Bot.loadHTTPS()
  // }, 1000)

  // fastify.get('/number', async (req, res) => {
  //   return { number: number }
  // })

  fastify.get('/sites', schema.todosGetOpt, async (req, res) => {
    return await sites.find().toArray()
  })

  fastify.get('/prices', schema.pricesGetOpt, async (req, res) => {
    const { site } = req.query
    const pricelist = fmdb.collection(site)
    const result = await pricelist.find().toArray()
    return JSON.stringify(result[result.length - 1])
  })

  fastify.post('/prices', schema.pricesPostOpt, async (req, res) => {
    const body = JSON.parse(req.body)
    body.created_at = new Date().getTime()
    const base = fmdb.collection(body.site)
    const result = await base.insertOne(body)
    return JSON.stringify(result.ops[0])
  })

  fastify.get('/settings', schema.settingsGetOpt, async (req, res) => {
    const { site } = req.query
    const result = await settings.find().toArray()
    return site ? result.filter(item => item.site === site) : result
  })

  fastify.post('/settings', schema.settingsPostOpt, async (req, res) => {
    const body = req.body
    body.created_at = new Date().getTime()
    body.updated_at = new Date().getTime()
    const result = await settings.insertOne(body)
    return JSON.stringify(result.ops[0])
  })

  fastify.get('/sites/:id', schema.todoGetOpt, async (req, res) => {
    const { id } = req.params
    const _id = fm.ObjectId(id)
    return await sites.findOne(_id)
  })

  fastify.post('/sites', schema.todoPostOpts, async (req, res) => {
    const site = req.body
    site.created_at = new Date().getTime()
    site.updated_at = new Date().getTime()
    const result = await sites.insertOne(site)
    return result.ops[0]
  })

  fastify.post('/build', schema.buildGetOpt, async (req, res) => {
    const { site1, site2 } = req.params
    return { site1, site2 }
  })

  done()
}

module.exports = routes
