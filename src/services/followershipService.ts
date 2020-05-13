import {
  DataLoaders,
  i18n,
  getDataLoaderByModel,
  errorRes,
  locales
} from '../utils'
import { ModelService } from './base'
import { FollowershipDocument, Followership, FollowedDataType } from '../models'
import { logger } from '../config'
import { notificationService } from './notification'

const followershipModel = new ModelService<FollowershipDocument>({
  model: Followership
})

const { statusMessages, errorMessages } = locales
const { follow, unfollow } = statusMessages.account
const { cannotFollowYourself } = errorMessages.account

const countAccountFollowers = followershipModel.countByBatch
const getAccountFollowersByBatch = followershipModel.batchFind

type FollowInput = {
  follower: string
  followedData: string
  followedDataType: FollowedDataType
}

const addFollowership = async (input: FollowInput, loaders: DataLoaders) => {
  const { follower, followedData, followedDataType } = input

  try {
    if (followedDataType === 'Account' && follower === followedData) {
      return { success: 0, message: i18n.t(cannotFollowYourself), code: 422 }
    }
    const loader: any = getDataLoaderByModel(followedDataType, loaders)

    const [me, data] = await Promise.all([
      loaders.accountLoader.load(follower),
      loader.load(followedData)
    ])
    const query = { followedData, followedDataType, follower }

    await followershipModel.createOrUpdate(query, { $set: query })
    const message = i18n.t(follow)

    if (followedDataType === 'Account') {
      const code = 'NEW_FOLLOWERS'
      const recipient = followedData

      notificationService.addNotification(
        { code, data: recipient, dataType: 'Account', recipient },
        loaders
      )
    }

    return { success: true, message, code: 200, me, following: data }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteFollowership = async (opts: FollowInput, loaders: DataLoaders) => {
  try {
    const { follower, followedData, followedDataType } = opts
    const query = { followedData, followedDataType, follower }

    const followership = await followershipModel.deleteOne(query)
    const message = i18n.t(unfollow)

    const loader = getDataLoaderByModel(followedDataType, loaders)
    const data = loader?.load(followership.followedData as any)
    const me = loaders.accountLoader.load(follower)

    return { success: true, message, code: 200, me, following: data }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteAccountFollowership = async (accountId: string) => {
  return Followership.deleteMany({
    $or: [
      { follower: accountId },
      { followedDataType: 'Account', followedData: accountId }
    ]
  } as any)
    .exec()
    .catch(e =>
      logger.error(`Error deleting account (${accountId}) followership: `, e)
    )
}

const deleteFollowers = async (dataId: string, dataType: FollowedDataType) => {
  return Followership.deleteMany({
    followedDataType: dataType,
    followedData: dataId as any
  })
    .exec()
    .catch(e =>
      logger.error(`Error deleting ${dataType} (${dataId}) followers: `, e)
    )
}

export const followershipService = {
  addFollowership,
  deleteFollowership,
  getAccountFollowersByBatch,
  countAccountFollowers,
  deleteAccountFollowership,
  deleteFollowers
}
export default followershipService
