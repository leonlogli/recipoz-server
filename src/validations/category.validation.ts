import Joi, { required } from '@hapi/joi'

import { languageSchema, objectIdSchema, idSchema } from './common.validation'
import { checkAndSendValidationErrors, renameI18nKeys } from '../utils'

const categorySchema = Joi.object({
  id: idSchema,
  language: languageSchema,
  parent: objectIdSchema,
  name: Joi.string()
    .min(3)
    .max(100)
    .when('$isNew', { is: true, then: required() }),
  description: Joi.string()
    .min(20)
    .max(280),
  thumbnail: Joi.string()
    .uri()
    .when('$isNew', { is: true, then: required() })
})

const validateCategory = (data: any, isNew = true) => {
  const { clientMutationId: _, ...category } = data
  const { error, value } = categorySchema.validate(category, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)
  const { language, ...others } = value

  return renameI18nKeys(others, language, 'name', 'description')
}

export { validateCategory }
