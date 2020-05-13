import jwt from 'jsonwebtoken'

import { firebaseAdmin, usersRef } from '../../config/firebase'
import {
  Role,
  Token,
  User,
  UserAdditionalInfo,
  UserDocument
} from '../../models'
import { clean, updateDataLoaderCache, DataLoaders } from '../../utils'
import { JWT, logger } from '../../config'

const auth = firebaseAdmin.auth()

type UpdateRequest = UserAdditionalInfo & firebaseAdmin.auth.UpdateRequest

const getUserInfo = (id: string) => {
  return usersRef
    .child(id)
    .once('value')
    .then(res => res.val())
}

const getUserRecord = auth.getUser

const getUserById = async (id: string): Promise<UserDocument | null> => {
  return Promise.all([auth.getUser(id), getUserInfo(id)])
    .then(([user, userInfo]) => {
      return { ...User.transform(user), ...userInfo }
    })
    .catch(e => {
      logger.error('Error fetching a user: ', e)

      return null
    })
}

const getUsers = async (ids: readonly string[]) => {
  return Promise.all(ids.map(id => getUserById(id)))
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

  const userInfo = clean({
    disabled,
    displayName,
    email,
    password,
    emailVerified,
    phoneNumber,
    photoURL
  })

  return { userInfo, additionalUserInfo: clean(additionalUserInfo) }
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
  let user: any = await auth.updateUser(id, userInfo)

  if (Object.keys({ ...additionalUserInfo }).length > 0) {
    // Update user additional profile info that is not handled by default in firebase authentification
    await usersRef.child(id).update(additionalUserInfo)
    user = {
      ...User.transform(user),
      ...(await usersRef.child(user.uid).once('value')).val()
    }
  }

  if (loaders) {
    updateDataLoaderCache(loaders.userLoader, user as UserDocument)
  }

  return user as UserDocument
}

const deleteUser = async (id: string) => {
  return Promise.all([
    auth.deleteUser(id),
    usersRef.child(id).remove()
  ]).catch(e => logger.error('Error deleting user: ', e))
}

const setRoles = async (id: string, ...roles: Role[]) => {
  return auth.setCustomUserClaims(id, { roles: [...new Set([...roles])] })
}

const verifyIdToken = (idToken: string) => auth.verifyIdToken(idToken, true)

const generateAccessToken = (payload: Record<string, string>) => {
  const expiresIn = JWT.EXPIRATION
  const payloadToSign = { ...payload, iat: Math.floor(Date.now() / 1000) }
  const accessToken = jwt.sign(payloadToSign, JWT.SECRET, { expiresIn })

  return { type: 'Bearer', accessToken, expiresIn } as Token
}

const revokeRefreshTokens = async (id: string) => {
  return auth.revokeRefreshTokens(id)
}

export const userService = {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  setRoles,
  verifyIdToken,
  revokeRefreshTokens,
  generateAccessToken,
  getUserRecord
}
export default userService
