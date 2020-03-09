import Joi from '@hapi/joi'

import { errorMessages } from '../constants'
import { checkAndSendValidationErrors } from '../utils'

const accountSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() }),
  website: Joi.string()
    .uri()
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() }),
  logo: Joi.string()
    .uri()
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() }),
  coverImage: Joi.string().uri(),
  about: Joi.string()
    .min(20)
    .max(280)
})

const validateRecipeSource = (source: any, isNew = true) => {
  const { error, value } = accountSchema.validate(source, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error, errorMessages.source.invalid)

  return value
}

export { validateRecipeSource }
