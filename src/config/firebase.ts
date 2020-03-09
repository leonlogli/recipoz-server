import * as admin from 'firebase-admin'

import { FIREBASE } from './env'

const { SERVICE_ACCOUNT } = FIREBASE

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT as any),
  databaseURL: FIREBASE.DB_URL
})

// Get a database reference to our blog
const db = admin.database()
const ref = db.ref('server/saving-data/recipoz')
const usersRef = ref.child('users')

export { usersRef, admin as firebaseAdmin }
export default admin
