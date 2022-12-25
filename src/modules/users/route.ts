import Fastify from 'fastify'
const userRouter = Fastify({ logger: true })

userRouter.get('/user/login', (request, reply) => {

})

export default userRouter
