import Joi from '@hapi/joi'

import { errorMessages } from '../constants'
import { languageSchema, objectIdSchema } from './common.validation'
import { checkAndSendValidationErrors, renameI18nKeys } from '../utils'

const categorySchema = Joi.object({
  language: languageSchema,
  parentCategory: objectIdSchema,
  name: Joi.string()
    .min(3)
    .max(100)
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() }),
  description: Joi.string()
    .min(20)
    .max(280),
  thumbnail: Joi.string()
    .uri()
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() })
})

const validateCategory = (category: any, isNew = true) => {
  const { error, value } = categorySchema.validate(category, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error, errorMessages.category.invalid)

  const { language, ...data } = value

  return renameI18nKeys(data, language, 'name', 'description')
}

export { validateCategory }
