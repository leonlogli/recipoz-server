import Joi from '@hapi/joi'

import { errorMessages } from '../constants'
import { costs, difficultyLevels, RecipeDocument } from '../models'
import { hasOwnProperties, checkAndSendValidationErrors } from '../utils'
import { objectIdSchema } from './common.validation'

const ingredientSchema = Joi.object({
  quantity: Joi.number()
    .positive()
    .required(),
  unit: objectIdSchema.required(),
  name: Joi.string()
    .required()
    .min(3)
    .max(80)
})

const stepSchema = Joi.object({
  instruction: Joi.string()
    .required()
    .min(3)
    .max(280),
  image: Joi.string().uri()
})

const recipeSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(80)
    .required(),
  description: Joi.string()
    .min(20)
    .max(280),
  image: Joi.string()
    .uri()
    .required(),
  video: Joi.string().uri(),
  additionalImages: Joi.array()
    .items(Joi.string().required())
    .unique()
    .min(1)
    .max(10)
    .invalid(Joi.ref('image')),
  servings: Joi.number()
    .positive()
    .required(),
  difficultyLevel: Joi.string().valid(...difficultyLevels),
  cost: Joi.string().valid(...costs),
  prepTime: Joi.number().positive(),
  cookTime: Joi.number().positive(),
  private: Joi.bool().required(),
  sourceUrl: Joi.string()
    .uri()
    .when(Joi.ref('authorType'), { is: 'RecipeSource', then: Joi.required() }),
  ingredients: Joi.array()
    .items(ingredientSchema)
    .required()
    .min(1)
    .max(20)
    .unique(),
  steps: Joi.array()
    .items(stepSchema)
    .min(1)
    .max(20)
    .unique()
    .when(Joi.ref('$isAdmin'), { is: false, then: Joi.required() }),
  source: objectIdSchema,
  authorType: Joi.string().valid('Account', 'RecipeSource'),
  categories: Joi.array()
    .items(objectIdSchema.required())
    .min(2)
    .unique()
    .sparse()
    .required(),
  tips: Joi.string()
    .min(10)
    .max(280)
}).or('prepTime', 'cookTime')

// Choose recipe author betwween 'source' and 'author' key
const chooseRecipeAuthor = (recipe: any, isAdmin: boolean) => {
  if (hasOwnProperties(recipe, 'source') && isAdmin) {
    recipe.authorType = 'RecipeSource'
  } else {
    recipe.authorType = 'Account'

    // In the validation schema, we use 'source' key instead of 'author' key because
    // the author is set only on the server side (to the current authenticated user).
    recipe.source = recipe.author
  }

  delete recipe.author // avoid 'not allowed' error for the 'author' key
}

const validatRecipe = (
  recipe: RecipeDocument,
  isAdmin: boolean,
  isNew = true
) => {
  chooseRecipeAuthor(recipe, isAdmin)

  const { error, value } = recipeSchema.validate(recipe, {
    abortEarly: false,
    context: { isAdmin, isNew }
  })

  checkAndSendValidationErrors(error, errorMessages.recipe.invalid)
  const { source, ...val } = value

  return { author: source, ...val } // do not forget to set author
}

export { validatRecipe }
export default validatRecipe
