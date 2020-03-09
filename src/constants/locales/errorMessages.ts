import { withNamespace } from '../../utils'

const errorMessages = {
  forbidden: 'forbidden',
  unauthenticated: 'unauthenticated',
  accessDenied: 'accessDenied',
  internalServerError: 'internalServerError',
  invalidId: 'invalidId',
  invalidFilter: 'invalidFilter',
  category: {
    notFound: 'categoryNotFound',
    invalid: 'invalidCategory',
    nameAlreadyExists: 'category.nameAlreadyExists'
  },
  measureUnit: {
    notFound: 'measureUnitNotFound',
    invalid: 'invalidMeasureUnit',
    nameAlreadyExists: 'measureUnit.nameAlreadyExists'
  },
  nutrient: {
    notFound: 'nutrientNotFound',
    invalid: 'invalidNutrient'
  },
  source: {
    notFound: 'sourceNotFound',
    invalid: 'invalidSource'
  },
  account: {
    notFound: 'accountNotFound',
    emailAlreadyExists: 'emailAlreadyExists',
    phoneNumberAlreadyExists: 'phoneNumberAlreadyExists',
    userNotFound: 'userNotFound',
    invalid: 'invalidAccount'
  },
  recipe: {
    notFound: 'recipeNotFound',
    invalid: 'invalidRecipe'
  }
}

export default withNamespace(errorMessages, 'errorMessages')
