import { withNamespace } from '../../utils/i18n'

export const errorMessages = withNamespace(
  {
    forbidden: 'forbidden',
    unauthenticated: 'unauthenticated',
    accessDenied: 'accessDenied',
    internalServerError: 'internalServerError',
    notFound: 'notFound',
    category: {
      notFound: 'categoryNotFound',
      nameAlreadyExists: 'category.nameAlreadyExists'
    },
    recipeSource: {
      notFound: 'recipeSourceNotFound',
      nameAlreadyExists: 'recipeSource.nameAlreadyExists',
      websiteAlreadyExists: 'recipeSource.websiteAlreadyExists'
    },
    account: {
      notFound: 'accountNotFound',
      cannotFollowYourself: 'account.cannotFollowYourself',
      cannotReportAbuseOnYourData: 'account.cannotReportAbuseOnYourData',
      alreadyExists: 'account.alreadyExists',
      emailAlreadyExists: 'emailAlreadyExists',
      phoneNumberAlreadyExists: 'phoneNumberAlreadyExists',
      userNotFound: 'userNotFound'
    },
    recipe: {
      notFound: 'recipeNotFound',
      alreadySaved: 'recipeAlreadySaved'
    },
    recipeCollection: {
      notFound: 'recipeCollectionNotFound',
      alreadyExists: 'recipeCollectionAlreadyExists'
    },
    shoppingListItem: {
      notFound: 'shoppingListItemNotFound'
    },
    comment: {
      notFound: 'commentNotFound'
    },
    abuseReport: {
      notFound: 'abuseReportNotFound'
    },
    notification: {
      notFound: 'notificationNotFound'
    }
  },
  'errorMessages'
)

export default errorMessages
