import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { id, required } from './common.validation'

const recipeSourceSchema = Joi.object({
  id,
  name: Joi.string()
    .min(3)
    .max(100)
    .when('$isNew', { is: true, then: required }),
  website: Joi.string()
    .uri()
    .when('$isNew', { is: true, then: required }),
  logo: Joi.string().when('$isNew', { is: true, then: required }),
  biography: Joi.string()
    .min(20)
    .max(280)
})

const validateRecipeSource = (data: any, isNew = true) => {
  const { clientMutationId: _, ...recipeSource } = data
  const { error, value } = recipeSourceSchema.validate(recipeSource, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateRecipeSource }
