import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { followedDataTypes } from '../models'
import { objectId } from './common.validation'

const followershipSchema = Joi.object({
  follower: objectId.required(),
  followedData: objectId.required(),
  followedDataType: Joi.valid(...followedDataTypes)
})

const validateFollowership = (data: any) => {
  const { clientMutationId: _, ...props } = data

  const { error, value } = followershipSchema.validate(props, {
    abortEarly: false
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateFollowership }
