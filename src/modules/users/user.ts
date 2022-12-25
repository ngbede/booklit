import { SupabaseClient, AuthError, User } from '@supabase/supabase-js'

export default class AuthUser {
  supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  _requestHandle(data: User | User[] | null, error: AuthError | null) {
    if (error) {
      console.error(error)
      throw new Error(error.message)
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

  async createUser(email: string, password: string, phoneNumber: string | null, metadata: Object | undefined) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      phone: phoneNumber!,
      user_metadata: metadata,
    })
    return this._requestHandle(data.user, error)
  }

  async loginUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    return this._requestHandle(data.user, error)
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
}
