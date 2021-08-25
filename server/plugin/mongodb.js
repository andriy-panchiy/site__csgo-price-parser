const fastifyPlugin = require('fastify-plugin')
const secrets = require('./api.js')

async function dbConnector (fastify, options) {
  console.log(options)
  fastify.register(require('fastify-mongodb'), {
    url: secrets.mongodb
  })
}

module.exports = fastifyPlugin(dbConnector)
