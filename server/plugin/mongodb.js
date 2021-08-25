const fastifyPlugin = require('fastify-plugin')
const api = require('./api.js')

async function dbConnector (fastify, options) {
  console.log(options)
  fastify.register(require('fastify-mongodb'), {
    url: api.mongodb
  })
}

module.exports = fastifyPlugin(dbConnector)
