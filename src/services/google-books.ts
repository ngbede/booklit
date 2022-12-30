import RestAdapter from "./rest-adapter"

export default class GoogleBooks {
  // for just search no api key needed
  apiKey?: string
  baseUrl: string
  restAdapter: RestAdapter

  private endpoints = {
    volumes: '/volumes'
  }

  constructor(apiKey?: string) {
    this.apiKey = apiKey || ''
    this.baseUrl = 'https://www.googleapis.com/books/v1'
    this.restAdapter = new RestAdapter(this.baseUrl, this.apiKey)
  }

  search(title: string, author: string) {
    let query = `${title}`
    if (author) {
      query = query.concat(`+inauthor:${author}`)
    }
    const options = { q: query }
    return this.restAdapter.read(this.endpoints.volumes, options)
  }

  getBook(id: string) {
    return this.restAdapter.read(`${this.endpoints.volumes}/${id}`)
  }
}
