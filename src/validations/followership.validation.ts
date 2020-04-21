import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { followedDataTypes } from '../models'
import { objectIdSchema } from './common.validation'

const followershipSchema = Joi.object({
  follower: objectIdSchema.required(),
  followedData: objectIdSchema.required(),
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
