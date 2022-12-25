import FirebaseAuthAdapter from './auth/firebase'
import Pg from '../db/pg'
import * as bcrypt from 'bcrypt'

interface AuthUser {
  id: string
  firebase_uid: string
  email: string,
  password_hash: string
  created_at: string
  updated_at: string
}

export class AuthInterface {
  private firebaseAuth: FirebaseAuthAdapter
  private pgClient: Pg
  private tableName: string
  private columns: string[]

  constructor(pg: Pg) {
    this.firebaseAuth = new FirebaseAuthAdapter()
    this.pgClient = pg
    this.tableName = 'auth.users'
    this.columns = ['firebase_uid', 'email', 'password_hash']
  }

  async createUser(email: string, password: string) {
    try {
      const user = await this.firebaseAuth.createUser(email, password)
      const hashPassword = bcrypt.hashSync(password, 12)
      const rows = await this.pgClient.query<AuthUser>(`
        INSERT INTO ${this.tableName} (${this.columns.toString()})
        VALUES ($1, $2, $3) RETURNING *
      `, [user.uid, user.email!, hashPassword])
      return rows[0]
    } catch (e) {
      console.error(e)
      throw new Error(`${e}`)
    }
  }

  async loginUser(email: string, password: string) {
    try {
      // fetch user from DB first
      const rows = await this.pgClient.query<AuthUser>(`
        SELECT * FROM ${this.tableName} WHERE email = $1
      `, [email])
      if (rows.length === 0) throw new Error(`Account does't exist for user with email ${email}`)
      const [userRecord] = rows
      console.log(userRecord)
      const checkPassword = bcrypt.compareSync(password, userRecord.password_hash)
      if (checkPassword) {
        const firebaseUser = await this.firebaseAuth.getUserViaUid(userRecord.firebase_uid)

      }
      throw new Error(`Invalid password sent`)
    } catch (e) {
      console.error(e)
      throw new Error(`${e}`)
    }
  }
}
