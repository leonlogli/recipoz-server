import jwt from 'jsonwebtoken'

import { firebaseAdmin, usersRef } from '../config/firebase'
import { errorMessages } from '../constants'
import { Role, Token, User, UserAdditionalInfo, UserDocument } from '../models'
import {
  removeUndefinedKeysFrom,
  ApiError,
  updateLoaderCache,
  DataLoaders
} from '../utils'
import { JWT } from '../config'

const auth = firebaseAdmin.auth()
const { userNotFound } = errorMessages.account

export type AuthOptions = Partial<
  Record<'id' | 'email' | 'phoneNumber', string>
>

type UpdateRequest = UserAdditionalInfo & firebaseAdmin.auth.UpdateRequest

const getUser = async (criteria: AuthOptions): Promise<UserDocument> => {
  const { id, email, phoneNumber } = criteria
  let user

  if (id && !!id.trim()) {
    user = await auth.getUser(id)
  } else if (email && !!email.trim()) {
    user = await auth.getUserByEmail(email)
  } else if (phoneNumber && !!phoneNumber.trim()) {
    user = await auth.getUserByPhoneNumber(phoneNumber)
  }

  if (!user) {
    throw new ApiError(userNotFound, '404')
  }

  return {
    ...User.transform(user),
    ...(await usersRef.child(user.uid).once('value')).val()
  }
}

const extractDataToUpdate = (dataToUpdate: UpdateRequest) => {
  const {
    disabled,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    photoURL,
    password,
    ...additionalUserInfo
  } = dataToUpdate || {}

  const userInfo = removeUndefinedKeysFrom({
    disabled,
    displayName,
    email,
    password,
    emailVerified,
    phoneNumber,
    photoURL
  })

  return {
    userInfo,
    additionalUserInfo: removeUndefinedKeysFrom(additionalUserInfo)
  }
}

const createUser = async (data: firebaseAdmin.auth.CreateRequest) => {
  return User.transform(await auth.createUser(data))
}

const updateUser = async (
  id: string,
  data: UpdateRequest,
  loaders?: DataLoaders
) => {
  const { userInfo, additionalUserInfo } = extractDataToUpdate(data)
  let user = await auth.updateUser(id, userInfo)

  if (Object.keys({ ...additionalUserInfo }).length > 0) {
    // Update user additional profile info that is not handled by default in firebase authentification
    await usersRef.child(id).update(additionalUserInfo)
    user = {
      ...User.transform(user),
      ...(await usersRef.child(user.uid).once('value')).val()
    }
  }

  if (loaders) {
    updateLoaderCache(loaders.userLoader, user as UserDocument)
  }

  return user as UserDocument
}

const deleteUser = async (id: string) => {
  return Promise.all([
    auth.deleteUser(id),
    usersRef.child(id).remove()
  ]).then(_values => getUser({ id }))
}

const setRoles = async (id: string, ...roles: Role[]) => {
  return auth.setCustomUserClaims(id, { roles: [...new Set([...roles])] })
}

/**
 * Verifies a Firebase ID token (JWT)
 * @param authToken The ID token to verify.
 */
const verifyIdToken = (authToken: string) => {
  return auth.verifyIdToken(authToken, true).then(payload => {
    const { uid, roles } = payload

    return { userId: uid, roles }
  })
}

/**
 * Returns new API accessToken with the specified payload
 * @param payload Payload to sign
 */
const generateAccessToken = (payload: Record<string, string>) => {
  const expiresIn = JWT.EXPIRATION
  const accessToken = jwt.sign(
    { ...payload, iat: Math.floor(Date.now() / 1000) },
    JWT.SECRET,
    { expiresIn }
  )

  return { type: 'Bearer', accessToken, expiresIn } as Token
}

/**
 * Revokes all refresh tokens for an existing user.
 * @param id The `uid` corresponding to the user whose refresh tokens are to be revoked.
 */
const revokeRefreshTokens = async (id: string) => {
  return auth.revokeRefreshTokens(id)
}

export default {
  getUser,
  updateUser,
  deleteUser,
  createUser,
  setRoles,
  verifyIdToken,
  revokeRefreshTokens,
  generateAccessToken
}
