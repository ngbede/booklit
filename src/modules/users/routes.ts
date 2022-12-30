import { FastifyInstance } from 'fastify'
import { baseUrl } from '../constants'
import { userSchema } from './schema'
import AuthUser from './auth-user'
import { supabaseAdmin } from '../../db/config'

const schema = {
  body: userSchema
}

const userRoute = async (fastify: FastifyInstance, options: Object) => {
  fastify.post(`${baseUrl}/user/signup`, { schema }, async (request, reply) => {
    const {
      email,
      password
    } = request.body as any
    const authApi = new AuthUser(supabaseAdmin, reply)
    const user = await authApi.createUser(email, password, request.body)
    return reply.status(200).send(user)
  })

  fastify.post(`${baseUrl}/user/login`, { schema }, async (request, reply) => {
    const { email, password } = request.body as any
    const authApi = new AuthUser(supabaseAdmin, reply)
    const user = await authApi.loginUser(email, password)
    return reply.status(200).send(user)
  })

  fastify.get(`${baseUrl}/user/reset-password`, (request, reply) => {
    return reply.status(200).send('Second route!!!')
  })
}

export default userRoute
