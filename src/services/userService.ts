import jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-express'
import status from 'http-status'

import { firebaseAdmin, JWT, logger, usersRef } from '../config'
import { Role, Token, User, UserAdditionalInfo } from '../models'
import { removeUndefinedKeysFrom, sendError, i18n } from '../utils'
import { errorMessages } from '../constants'

const auth = firebaseAdmin.auth()
const { userNotFound } = errorMessages.account

export type AuthOptions = Partial<
  Record<'id' | 'email' | 'phoneNumber', string>
>

type UpdateRequest = UserAdditionalInfo & firebaseAdmin.auth.UpdateRequest

const createUser = async (data: firebaseAdmin.auth.CreateRequest) => {
  try {
    return User.transform(await auth.createUser(data))
  } catch (e) {
    sendError(e)
  }
}

const getUser = async (criteria: AuthOptions) => {
  const { id, email, phoneNumber } = criteria

  try {
    let user

    if (id && !!id.trim()) {
      user = await auth.getUser(id)
    }
    if (email && !!email.trim()) {
      user = await auth.getUserByEmail(email)
    }
    if (phoneNumber && !!phoneNumber.trim()) {
      user = await auth.getUserByPhoneNumber(phoneNumber)
    }

    if (user) {
      return {
        ...User.transform(user),
        ...(await usersRef.child(user.uid).once('value')).val()
      }
    }
    throw new ApolloError(i18n.t(userNotFound), status['404_NAME'])
  } catch (e) {
    sendError(e)
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
    ...additionalUserInfo
  } = dataToUpdate

  const userInfo = removeUndefinedKeysFrom({
    disabled,
    displayName,
    email,
    emailVerified,
    phoneNumber,
    photoURL
  })

  return {
    userInfo,
    additionalUserInfo: removeUndefinedKeysFrom(additionalUserInfo)
  }
}

const updateUser = async (id: string, data: UpdateRequest) => {
  const { userInfo, additionalUserInfo } = extractDataToUpdate(data)

  try {
    if (Object.keys(userInfo).length > 0) {
      auth.updateUser(id, userInfo)
    }
    if (Object.keys(additionalUserInfo).length > 0) {
      // Update user additional profile info that is not handled by default in firebase authentification
      usersRef.child(id).update(additionalUserInfo)
    }
  } catch (e) {
    sendError(e)
  }
}

const deleteUser = async (id: string) => {
  try {
    auth.deleteUser(id)
    usersRef.child(id).remove()
  } catch (e) {
    sendError(e)
  }
}

const setUserRoles = async (id: string, ...roles: Role[]) => {
  try {
    return auth.setCustomUserClaims(id, { roles: [...new Set([...roles])] })
  } catch (e) {
    sendError(e)
  }
}

/**
 * Verifies a Firebase ID token (JWT)
 * @param authToken The ID token to verify.
 */
const verifyIdToken = (authToken: string) => {
  return auth
    .verifyIdToken(authToken, true)
    .then(payload => {
      const { uid, roles } = payload

      return { userId: uid, roles }
    })
    .catch(error => sendError(error))
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
  return auth.revokeRefreshTokens(id).then(async () => {
    const user = await getUser({ id })

    logger.info('Tokens revoked for user: ', user.uid)

    return user
  })
}

export default {
  getUser,
  updateUser,
  deleteUser,
  createUser,
  setUserRoles,
  verifyIdToken,
  revokeRefreshTokens,
  generateAccessToken
}
