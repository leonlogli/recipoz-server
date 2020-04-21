import { firebaseAdmin } from '../config'
import { ADMIN, USER } from '../constants'

/**
 * User additionnal info that aren't handled in the authentication
 */
export interface UserAdditionalInfo {
  coverImageUrl?: string
  gender?: string
  location?: string
  website?: string
  biography?: string
  birthday?: Date
  facebook?: string
  pinterest?: string
  twitter?: string
  instagram?: string
  language?: string
  theme?: string
}

const userRoles = [ADMIN, USER] as const

/**
 * User roles
 */
export type Role = typeof userRoles[number]

export type Token = {
  type?: string
  accessToken: string
  expiresIn?: string
}

export type DecodedAccessToken = {
  /**
   * ID of the account this user belong to
   */
  id: string
  roles: Role[]
}

type UserRecord = firebaseAdmin.auth.UserRecord & UserAdditionalInfo

export type UserDocument = UserRecord & {
  _id: string // this just to allow for interoperability with mongoose Document
  roles: Role[]
}

export const User = {
  /**
   * Returns a formatted user from the specified firebase UserRecord
   *
   * @param fireBaseUser UserRecord from firebase
   */
  transform: (fireBaseUser: UserRecord): UserDocument => {
    const _id = fireBaseUser.uid
    const roles = fireBaseUser.customClaims?.roles

    return { ...fireBaseUser, _id, roles }
  }
}

export default User
