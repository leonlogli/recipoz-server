import Joi, { required } from '@hapi/joi'

import { costs, difficultyLevels, Ingredient } from '../models'
import { checkAndSendValidationErrors, hasDuplicates } from '../utils'
import { objectIdSchema, idSchema } from './common.validation'

const instructionSchema = Joi.object({
  text: Joi.string()
    .required()
    .min(3)
    .max(280),
  image: Joi.string().uri()
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
  id: idSchema,
  name: Joi.string()
    .min(3)
    .max(80)
    .when('$isNew', { is: true, then: required() }),
  description: Joi.string()
    .min(20)
    .max(280),
  image: Joi.string()
    .uri()
    .when('$isNew', { is: true, then: required() }),
  video: Joi.string().uri(),
  additionalImages: Joi.array()
    .items(Joi.string().required())
    .unique()
    .min(1)
    .max(10)
    .invalid(Joi.ref('image')),
  servings: Joi.number()
    .positive()
    .when('$isNew', { is: true, then: required() }),
  difficultyLevel: Joi.string().valid(...difficultyLevels),
  cost: Joi.string().valid(...costs),
  prepTime: Joi.number().positive(),
  cookTime: Joi.number().positive(),
  private: Joi.bool(),
  sourceUrl: Joi.string()
    .uri()
    .when('authorType', {
      is: 'RecipeSource',
      then: Joi.when('$isNew', { is: true, then: required() })
    }),
  ingredients: Joi.array()
    .items(ingredientSchema)
    .min(1)
    .max(20)
    .unique()
    .custom(ingredientsValidator, 'ingredients custom validation')
    .when(Joi.ref('$isNew'), { is: true, then: Joi.required() }),
  steps: Joi.array()
    .items(instructionSchema)
    .min(1)
    .max(20)
    .unique()
    .when('authorType', {
      is: 'Account',
      then: Joi.when('$isNew', { is: true, then: required() })
    }),
  author: objectIdSchema,
  authorType: Joi.string().valid('Account', 'RecipeSource'),
  categories: Joi.array()
    .items(objectIdSchema.required())
    .min(2)
    .unique()
    .when('$isNew', {
      is: true,
      then: Joi.when('$isNew', { is: true, then: required() })
    }),
  tips: Joi.string()
    .min(20)
    .max(280)
}).or('prepTime', 'cookTime')

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
