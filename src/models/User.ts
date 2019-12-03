import { firebaseAdmin } from '../config'

/**
 * User additionnal info that aren't handled in the authentication
 */
export interface UserAdditionalInfo {
  coverImageUrl?: string
  gender?: string
  location?: string
  website?: string
  aboutMe?: string
  socials?: string[]
}

const userRoles = ['ADMIN', 'USER'] as const

/**
 * User roles
 */
export type Role = typeof userRoles[number]

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
