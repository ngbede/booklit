import { user } from '@prisma/client'
import { SupabaseClient, User, AuthApiError, AuthError, Session } from '@supabase/supabase-js'
import { FastifyReply } from 'fastify'
import DBAdapter from '../../api/db-adapter'
import { pgInstance } from '../../db/pg'

enum EmailLinkTypes {
  signup = 'signup',
  invite = 'invite',
  magiclink = 'magiclink',
  recovery = 'recovery'
}

export default class AuthUser {
  supabase: SupabaseClient
  reply: FastifyReply
  dbAdapter: DBAdapter

  constructor(supabase: SupabaseClient, reply: FastifyReply) {
    this.supabase = supabase
    this.reply = reply
    this.dbAdapter = new DBAdapter(
      pgInstance,
      'user',
      reply
    )
  }

  private _requestHandle<T>(data: T | null, error: AuthError | null) {
    if (error) {
      const err = error as AuthApiError
      console.error(error)
      return this.reply.status(err.status || 500).send({
        error: err.message || 'Internal Server Error'
      })
    }
    return data
  }

  async fetchUserViaId(uuid: string) {
    const { data, error } = await this.supabase.auth.admin.getUserById(uuid)
    return this._requestHandle(data.user, error)
  }

  async listUsers() {
    const { data, error } = await this.supabase.auth.admin.listUsers()
    return this._requestHandle(data.users, error)
  }

  async createUser(email: string, password: string, userData: any | undefined) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password
    })
    if (error) return this._requestHandle(data.user, error)
    const newUser = await this.dbAdapter.create<user>({
      auth_id: data.user.id,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      display_name: userData.displayName,
      phone_number: userData.phoneNumber
    })
    const { data: magicLinkData } = await this.createMagicLink(email, password, EmailLinkTypes.signup)
    const resData = Object.assign(data.user!, { ...magicLinkData.properties, user_detail: { ...newUser } })
    return this._requestHandle(resData, error)
  }

  async loginUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    return this._requestHandle<Session>(data.session, error)
  }

  async resetPassword(uuid: string, password: string) {
    const { data, error } = await this.supabase.auth.admin.updateUserById(uuid, {
      password
    })
    return this._requestHandle(data.user, error)
  }

  async deleteUserViaId(uuid: string) {
    const { data, error } = await this.supabase.auth.admin.deleteUser(uuid)
    return this._requestHandle(data.user, error)
  }

  createMagicLink(email: string, password: string, linkType: EmailLinkTypes) {
    return this.supabase.auth.admin.generateLink({
      type: linkType,
      email,
      password,
    })
  }
}
