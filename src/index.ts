import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import FirebaseAuthAdapter, { authService } from './services/auth/firebase'
import '@fastify/express'
import { pgInstance } from './db/pg'
import { AuthInterface } from './services'

const fastify = Fastify({ logger: true })
fastify.register(require('@fastify/express'))

fastify.get('/msg/:id', (request, reply) => {
  console.log(request.params)
  return reply.status(404).send({ msg: 'Hello Bro!' })
})

fastify.listen({ port: 3000 }, async (err, address) => {
  await pgInstance.connect()
  // console.log(pgInstance)

  await pgInstance.query('SELECT * from auth.users').then(d => {
    console.log(d)
  })

  if (err) {
    fastify.log.error(err)
  }
  console.log('running')
})
