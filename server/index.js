const fastify = require('fastify')({ logger: true, pluginTimeout: 20000, bodyLimit: 52428800 })
const Parser = require('./plugin/parser')
// const fetch = require('node-fetch')

fastify.register(require('./plugin/mongodb'))
fastify.register(require('./plugin/routes'))

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
