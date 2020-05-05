import Joi from '@hapi/joi'

import { costs, difficultyLevels, Ingredient } from '../models'
import { checkAndSendValidationErrors, hasDuplicates } from '../utils'
import { objectId, id, uri, required } from './common.validation'

const instructionSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(3)
    .max(280),
  image: uri
})

const ingredientSchema = Joi.object({
  quantity: Joi.string()
    .min(1)
    .max(30),
  name: Joi.string()
    .required()
    .min(1)
    .max(80),
  group: Joi.string()
})

const ingredientsValidator = (
  value: Ingredient[],
  helpers: Joi.CustomHelpers
) => {
  if (hasDuplicates(value.map(i => ({ group: i.group, name: i.name })))) {
    return helpers.error('any.invalid')
  }

  // Return the value unchanged
  return value
}

const recipeSchema = Joi.object({
  id,
  name: Joi.string()
    .min(3)
    .max(80)
    .when('$isNew', { is: true, then: required }),
  description: Joi.string()
    .min(20)
    .max(280),
  image: uri.when('$isNew', { is: true, then: required }),
  video: uri,
  additionalImages: Joi.array()
    .items(uri.required())
    .unique()
    .min(1)
    .max(10)
    .invalid(Joi.ref('image')),
  servings: Joi.number()
    .integer()
    .positive()
    .when('$isNew', { is: true, then: required }),
  difficultyLevel: Joi.string().valid(...difficultyLevels),
  cost: Joi.string().valid(...costs),
  prepTime: Joi.number()
    .integer()
    .positive(),
  cookTime: Joi.number()
    .integer()
    .positive(),
  private: Joi.bool(),
  ingredients: Joi.array()
    .items(ingredientSchema)
    .min(1)
    .max(20)
    .unique()
    .custom(ingredientsValidator, 'ingredients custom validation')
    .when('$isNew', { is: true, then: required }),
  instructions: Joi.array()
    .items(instructionSchema)
    .min(1)
    .max(20)
    .unique()
    .when('$isNew', { is: true, then: required }),
  author: objectId.required(),
  source: objectId,
  sourceLink: uri,
  categories: Joi.array()
    .items(objectId.required())
    .min(2)
    .unique()
    .when('$isNew', { is: true, then: required }),
  tips: Joi.string()
    .min(20)
    .max(280)
})
  .and('source', 'sourceLink')
  .when('$isNew', { is: false, then: Joi.object().or('prepTime', 'cookTime') })

const validatRecipe = (data: any, isNew = true) => {
  const { clientMutationId: _, source: _source, ...recipe } = data
  const { error, value } = recipeSchema.validate(recipe, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validatRecipe }
export default validatRecipe
