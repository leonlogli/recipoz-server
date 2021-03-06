import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { id, objectId, required } from './common.validation'

const recipeCollectionSchema = Joi.object({
  id,
  account: objectId.required(),
  name: Joi.string()
    .min(1)
    .max(80)
    .when('$isNew', { is: true, then: required }),
  description: Joi.string()
    .min(20)
    .max(280),
  private: Joi.boolean()
})

const validateRecipeCollection = (data: any, isNew = true) => {
  const { clientMutationId: _, ...collection } = data
  const { error, value } = recipeCollectionSchema.validate(collection, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateRecipeCollection }
