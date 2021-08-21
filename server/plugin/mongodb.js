const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  console.log(options)
  fastify.register(require('fastify-mongodb'), {
    url: 'mongodb+srv://admin:sQBSkNKj4Jmu2tbT@cluster0.fntga.mongodb.net/test'
  })
}

module.exports = fastifyPlugin(dbConnector)
