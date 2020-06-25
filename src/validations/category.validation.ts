import Joi from '@hapi/joi'

import { language, objectId, id, required } from './common.validation'
import { checkAndSendValidationErrors, renameI18nKeys } from '../utils'

const categorySchema = Joi.object({
  id,
  language,
  parent: objectId,
  name: Joi.string()
    .min(3)
    .max(100)
    .when('$isNew', { is: true, then: required }),
  description: Joi.string()
    .min(20)
    .max(280),
  thumbnail: Joi.string().when('$isNew', { is: true, then: required })
})

const validateCategory = (data: any, isNew = true) => {
  const { clientMutationId: _, ...category } = data
  const { error, value } = categorySchema.validate(category, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)
  const { language: lang, ...others } = value

  return renameI18nKeys(others, lang, 'name', 'description')
}

export { validateCategory }
