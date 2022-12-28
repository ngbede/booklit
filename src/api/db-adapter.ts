import { SupabaseClient, PostgrestError } from '@supabase/supabase-js'
import { FastifyReply } from 'fastify'
import { supabaseAdmin, supabase } from '../db/config'
import Pg from '../db/pg'

export default class DBAdapter {
  supabase: SupabaseClient
  reply: FastifyReply
  pg: Pg
  tableName: string
  nameSpace: string

  constructor(pg: Pg, tableName: string, reply: FastifyReply, nameSpace?: string) {
    this.pg = pg
    this.tableName = tableName
    this.nameSpace = nameSpace || this.tableName
    this.supabase = this.nameSpace === 'user' ? supabaseAdmin : supabase
    this.reply = reply
  }

  private _requestHandle(data: any | null, error: PostgrestError | null) {
    if (error) {
      console.error(error)
      return this.reply.status(400).send({
        error: error.message || 'Internal Server Error'
      })
    }
    return data
  }

  async getViaId(uuid: string) {
    const { data, error } = await this.supabase.from(this.tableName)
      .select('*')
      .match({ id: uuid })
    return this._requestHandle(data, error)
  }

  async create(payload: Object | Object[]) {
    const { data, error } = await this.supabase.from(this.tableName)
      .insert(payload)
      .select('*')
    return this._requestHandle(data, error)
  }

  async update(payload: Object, targetColumn: string, id: string) {
    const { data, error } = await this.supabase.from(this.tableName)
      .update(payload)
      .eq(targetColumn, id)
      .select('*')
    return this._requestHandle(data, error)
  }

  async delete(uuid: string) {
    const { data, error } = await this.supabase.from(this.tableName)
      .delete()
      .match({ id: uuid })
    return this._requestHandle(data, error)
  }

  async query<T>(queryString: string, queryParams: string[] | undefined) {
    try {
      const data = await this.pg.query<T>(queryString, queryParams)
      return data
    } catch (error) {
      console.error(error)
      // TODO: err handle
    }
  }
}
