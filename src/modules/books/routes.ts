import { FastifyInstance } from 'fastify'
import { baseUrl } from '../constants'
import { queryParams } from './schema'
import GoogleBooks from '../../services/google-books'

const schema = {
  querystring: queryParams
}

interface bookObject {
  title: string
  author: string
}

const booksRoute = async (fastify: FastifyInstance, options: Object) => {
  const booksApi = new GoogleBooks()
  fastify.get(`${baseUrl}/books/search`, { schema }, async (request, reply) => {
    const query = request.query as bookObject
    // this returns { kind, totalItems, items }
    const searchData: any = await booksApi.search(query.title, query.author)
    return reply.status(200).send(searchData.items)
  })

  fastify.get(`${baseUrl}/books/:googleId`, async (request, reply) => {
    const params = request.params as any
    const book = await booksApi.getBook(params.googleId)
    return reply.status(200).send(book)
  })
}

export default booksRoute
