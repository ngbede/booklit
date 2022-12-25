import { Pool, Client } from 'pg'
import { params } from './config'

export default class Pg {
  config: object // connection params
  _pool: Pool
  _client: Client

  constructor(config: object) {
    this.config = config
    this._pool = new Pool(config)
    this._client = new Client(config)
  }

  connect() {
    return this._pool.connect()
  }

  disconnect() {
    return this._pool.end()
  }

  /**
   * return client instance for single use then close connection
   */
  getClient() {
    return this._client
  }

  async query<T>(queryString: string, queryParams?: Array<String>): Promise<T[]> {
    const { rows } = await this._pool.query(queryString, queryParams)
    return rows
  }
}

// create new instance
export const pgInstance = new Pg(params)
