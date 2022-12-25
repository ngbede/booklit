import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import 'dotenv/config'

initializeApp({
  credential: applicationDefault(),
  databaseURL: 'https://melon-auth.firebaseio.com'
})

interface updateFields {
  password?: string,
  phoneNumber?: string
  displayName?: string
  disabled?: boolean
}

export default class FirebaseAuthAdapter {
  createUser(email: string, password: string) {
    return getAuth().createUser({
      email,
      password,
      emailVerified: true
    })
  }

  updateUser(uid: string, fields: updateFields) {
    return getAuth().updateUser(uid, fields)
  }

  getUserViaEmail(email: string) {
    return getAuth().getUserByEmail(email)
  }

  getUserViaUid(uid: string) {
    return getAuth().getUser(uid)
  }

  createIdToken(uid: string) {
    return getAuth().createCustomToken(uid)
  }
}

export const authService = getAuth()
