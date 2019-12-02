import { firebaseAdmin, usersRef, logger } from '../config'
import { UserAdditionalInfo, User } from '../models'

const auth = firebaseAdmin.auth()

type DataSnapshot = firebaseAdmin.database.DataSnapshot
type UpdateRequest = firebaseAdmin.auth.UpdateRequest

/**
 * Gets the user data for the user corresponding to a given id.
 * @param id the user uid
 */
const getUser = async (id: string) => {
  const user = await auth.getUser(id)
  /* 
  usersRef.once('value', data => {
    // do some stuff once
  })
   */

  return User.transform(user)
}

/**
 * Gets the user data for the user corresponding to a given email.
 * @param email The email corresponding to the user whose data to fetch.
 */
const getUserByEmail = async (email: string) => {
  const user = await auth.getUserByEmail(email)

  return User.transform(user)
}

/**
 * Updates an existing user.
 * @param uid The `uid` corresponding to the user to update.
 * @param data The data to update on the provided user.
 */
const updateUser = async (id: string, data: UpdateRequest) => {
  const user = await auth.updateUser(id, data)

  return User.transform(user)
}

/**
 * Deletes an existing user.
 * @param id The `uid` corresponding to the user to delete.
 */
const deleteUser = async (id: string) => {
  auth.deleteUser(id)
}

/**
 * Retrieves a list of users (single batch only) with a size of `maxResults`
 * starting from the offset as specified by `pageToken`
 * @param maxResults The page size, 1000 if undefined. This is also the maximum allowed limit.
 * @param pageToken The next page token. If not specified, returns users starting without any offset.
 */
const getUsers = async (maxResults?: number, pageToken?: string) => {
  const listUsersResult = await auth.listUsers(maxResults, pageToken)

  return listUsersResult.users.map(user => User.transform(user))
}

/**
 * Add user additional profile info that is not handled by default in firebase authentification
 * @param id the user id
 * @param data additional profile info
 */
const addUserExtraInfo = async (id: string, data: UserAdditionalInfo) => {
  let user = await getUser(id)
  // Callback to retrieve new UserAdditionalInfo as they are added to the database
  const callback = (snapshot: DataSnapshot | null) => {
    if (snapshot) {
      logger.info(`UserAdditionalInfo added - user id : ${snapshot.key}`)
      if (snapshot.key === id) {
        user = { ...user, ...snapshot.val() }
      }
    }
  }

  usersRef.on('child_added', callback)

  usersRef.child(id).set(data, (error: Error | null) => {
    if (error) {
      throw error
    } else {
      usersRef.off('child_added', callback)
    }
  })

  return user
}

/**
 * Update user additional profile info that is not handled by default in firebase authentification
 * @param id the user id
 * @param data additional profile info
 */
const updateUserExtraInfo = async (id: string, data: UserAdditionalInfo) => {
  let user = await getUser(id)
  // Get the UserAdditionalInfo data on a user that has changed
  const callback = (snapshot: DataSnapshot | null) => {
    if (snapshot) {
      logger.info(`UserAdditionalInfo updated - user id : ${snapshot.key}`)
      if (snapshot.key === id) {
        user = { ...user, ...snapshot.val() }
      }
    }
  }

  usersRef.on('child_changed', callback)

  usersRef.child(id).update(data, (error: Error | null) => {
    if (error) {
      throw error
    } else {
      usersRef.off('child_changed', callback)
    }
  })

  return user
}

export default {
  getUserByEmail,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  addUserExtraInfo,
  updateUserExtraInfo
}
