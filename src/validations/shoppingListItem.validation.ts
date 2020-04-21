import Joi, { required } from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { objectIdSchema, idSchema } from './common.validation'
import { shoppingListItemCategories } from '../models'

const itemSchemaObj = {
  quantity: Joi.string()
    .min(1)
    .max(30),
  name: Joi.string()
    .required()
    .min(1)
    .max(80)
    .when('$isNew', { is: true, then: required() })
}

const shoppingListItemSchema = Joi.object({
  id: idSchema,
  account: objectIdSchema.required(),
  recipe: objectIdSchema,
  ...itemSchemaObj,
  category: Joi.string().valid(...shoppingListItemCategories),
  checked: Joi.boolean()
})

const shoppingListItemsSchema = Joi.object({
  recipe: objectIdSchema.required(),
  account: objectIdSchema.required(),
  items: Joi.array()
    .items(Joi.object(itemSchemaObj).required())
    .min(1)
    .unique()
})

const validateShoppingListItem = (data: any, isNew = true) => {
  const { clientMutationId: _, ...shoppingListItem } = data
  const { error, value } = shoppingListItemSchema.validate(shoppingListItem, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

const validateShoppingListItems = (data: any, isNew = true) => {
  const { clientMutationId: _, ...shoppingListItems } = data
  const { error, value } = shoppingListItemsSchema.validate(shoppingListItems, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateShoppingListItem, validateShoppingListItems }
