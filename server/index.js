const fastify = require('fastify')({ logger: true, pluginTimeout: 20000, bodyLimit: 52428800 })
const Parser = require('./plugin/parser')
const path = require('path')
// const fetch = require('node-fetch')

fastify.register(require('./plugin/mongodb'))
fastify.register(require('./plugin/routes'))
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../client')
})

const start = async () => {
  try {
    await fastify.listen(3000)
    const Bot = new Parser()
    Bot.load()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
