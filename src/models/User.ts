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
    const { passwordHash: _ph, passwordSalt: _ps, ...otherProps } = fireBaseUser

    return { id: fireBaseUser.uid, ...otherProps }
  }
}

export default User
