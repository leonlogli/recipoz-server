import Joi from '@hapi/joi'

import { id, objectId } from './common.validation'
import { checkAndSendValidationErrors } from '../utils'

const notificationSchema = Joi.object({
  id,
  recipient: objectId.required(),
  read: Joi.boolean()
})

const validateNotification = (data: any, isNew = true) => {
  const { clientMutationId: _, ...notification } = data
  const { error, value } = notificationSchema.validate(notification, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateNotification }
