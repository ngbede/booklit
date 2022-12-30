import Fastify from 'fastify'
import '@fastify/express'
import { pgInstance } from './db/pg'

const fastify = Fastify({ logger: true })
fastify.register(require('@fastify/express'))
fastify.register(require('./modules/users/routes'))
fastify.register(require('./modules/books/routes'))

fastify.listen({ port: 3000 }, async (err, address) => {
  await pgInstance.connect()

  if (err) {
    fastify.log.error(err)
  }
  console.log('running')
})
