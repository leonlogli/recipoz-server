import jwt from 'jsonwebtoken'
import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { firebaseAdmin, logger, JWT } from '../config'
import { Role, User, UserDocument, Token } from '../models'

const auth = firebaseAdmin.auth()

/**
 * Checks if our user has an admin role
 * @param user the user
 */
const isAdmin = (user: UserDocument): boolean => {
  const claims: any = user.customClaims
  const userRoles = (claims && claims.roles) || []

  return userRoles.includes('ADMIN')
}

/**
 * Overide user roles
 * @param user the user
 * @param roles the user role. Ex: 'ADMIN', 'USER'
 */
const setRoles = async (user: UserDocument, roles: Role | [Role]) => {
  const claims: any = user.customClaims
  const userRoles = (claims && claims.roles) || []
  const _roles = typeof roles === 'string' ? [roles] : roles

  auth.setCustomUserClaims(user.uid, {
    roles: [...new Set([...userRoles, ..._roles])]
  })
}

/**
 * Creates a new user.
 * @param data The data to set on the new user record to be created.
 */
const register = async (data: firebaseAdmin.auth.CreateRequest) => {
  const user = await auth.createUser(data)

  return User.transform(user)
}

/**
 * Return new API accessToken with the specified firebase authToken.
 * If the idToken is not revoked, access_token is returned, otherwise throw error
 * @param authToken The the user ID token issued from firebase
 */
const getAccessToken = (authToken: string) => {
  return auth
    .verifyIdToken(authToken, true)
    .then(payload => {
      // authToken is valid. Generate access_token
      const accessToken = jwt.sign(
        {
          id: payload.uid,
          roles: payload.roles,
          iat: Math.floor(Date.now() / 1000)
        },
        JWT.SECRET,
        { expiresIn: JWT.EXPIRATION }
      )

      const token: Token = {
        type: 'Bearer',
        accessToken,
        expiresIn: JWT.EXPIRATION
      }

      return token
    })
    .catch(error => {
      if (error.code === 'auth/id-token-revoked') {
        // authToken has been revoked. Inform the user to reauthenticate
        throw new ApolloError('You must reauthenticate !', error.code)
      } else {
        // authToken is invalid.
        throw new AuthenticationError('Access denied !')
      }
    })
}

/**
 * Revokes all refresh tokens for an existing user.
 *  @param id The `uid` corresponding to the user whose refresh tokens are to be revoked.
 */
const revokeRefreshTokens = async (id: string) => {
  return firebaseAdmin
    .auth()
    .revokeRefreshTokens(id)
    .then(() => {
      return firebaseAdmin.auth().getUser(id)
    })
    .then(user => {
      return new Date(user.tokensValidAfterTime as string).getTime() / 1000
    })
    .then(timestamp => {
      logger.info('Tokens revoked at: ', timestamp)

      return timestamp
    })
}

export default {
  register,
  getAccessToken,
  isAdmin,
  revokeRefreshTokens,
  setRoles
}
