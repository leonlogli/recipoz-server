import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { recipeCollectionTypes } from '../models'
import { objectId } from './common.validation'

const savedRecipeSchema = Joi.object({
  collectionType: Joi.valid(...recipeCollectionTypes),
  recipeCollection: objectId,
  account: objectId.required(),
  recipe: objectId.required()
}).without('collectionType', 'recipeCollection')

const validateSavedRecipe = (data: any) => {
  const { clientMutationId: _, ...props } = data

  const { error, value } = savedRecipeSchema.validate(props, {
    abortEarly: false
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateSavedRecipe }
