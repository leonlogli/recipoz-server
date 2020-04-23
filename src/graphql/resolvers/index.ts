import {
  URLResolver,
  EmailAddressResolver,
  PhoneNumberResolver,
  PositiveIntResolver,
  DateTimeResolver
} from 'graphql-scalars'

import userResolver from './userResolver'
import categoryResolver from './categoryResolver'
import recipeSourceResolver from './recipeSourceResolver'
import commonResolver from './commonResolver'
import shoppingListResolver from './shoppingListResolver'
import commentResolver from './commentResolver'
import abuseReportResolver from './abuseReportResolver'
import followershipResolver from './followershipResolver'
import searchResolver from './searchResolver'
import savedRecipeResolver from './savedRecipeResolver'
import notificationResolver from './notificationResolver'
import recipeCollectionResolver from './recipeCollectionResolver'
import recipe from './recipe'
import account from './account'

export default [
  userResolver,
  categoryResolver,
  recipeSourceResolver,
  commonResolver,
  shoppingListResolver,
  commentResolver,
  abuseReportResolver,
  followershipResolver,
  searchResolver,
  savedRecipeResolver,
  notificationResolver,
  recipeCollectionResolver,
  ...recipe,
  ...account,
  // custom scalars
  {
    URL: URLResolver,
    PositiveInt: PositiveIntResolver,
    EmailAddress: EmailAddressResolver,
    PhoneNumber: PhoneNumberResolver,
    DateTime: DateTimeResolver
  }
]
