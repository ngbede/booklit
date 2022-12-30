import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
require('dotenv/config')

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

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.ANON_KEY!
)

// use for auth related stuff master key with elevated priviledges
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SERVICE_ROLE!
)
