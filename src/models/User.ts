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
  language?: string[]
  theme?: string
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

export const User = {
  /**
   * Returns a formatted user from the specified firebase UserRecord
   *
   * @param fireBaseUser UserRecord from firebase
   */
  transform: (fireBaseUser: UserRecord): UserDocument => {
    const {
      uid,
      passwordHash: _ph,
      passwordSalt: _ps,
      customClaims,
      ...otherProps
    } = fireBaseUser

    const roles = customClaims && (customClaims as any).roles

    return { id: uid, roles, ...otherProps } as any
  }
}

export default User
