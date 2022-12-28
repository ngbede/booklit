import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
require('dotenv/config')

interface Database {
  public: {
    Tables: {
      books: {
        Row: {} // The data expected to be returned from a "select" statement.
        Insert: {} // The data expected passed to an "insert" statement.
        Update: {} // The data expected passed to an "update" statement.
      }
    }
  }
}

export const params = {
  user: process.env.DBUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.DBPORT!),
  max: 30,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 60000
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.ANON_KEY!
)

// use for auth related stuff master key with elevated priviledges
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SERVICE_ROLE!
)
