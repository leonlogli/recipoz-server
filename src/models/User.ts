/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { firebaseAdmin } from '../config'

export interface UserAdditionalInfo {
  coverImageUrl?: string
  gender?: string
  location?: string
  website?: string
  aboutme?: string
  socials?: string[]
}

export type Role = 'ADMIN' | 'USER'

export type Token = {
  type?: string
  accessToken: string
  expiresIn?: string
}

type UserRecord = firebaseAdmin.auth.UserRecord & UserAdditionalInfo

export type UserDocument = UserRecord & {
  id: string
}

const User = {
  /**
   * Returns a formatted user from the specified firebase UserRecord
   *
   * @param fireBaseUser UserRecord from firebase
   */
  transform: (fireBaseUser: UserRecord): UserDocument => {
    const { uid, passwordHash, passwordSalt, ...otherProps } = fireBaseUser

    return { uid, id: uid, ...otherProps }
  }
}

export default User
