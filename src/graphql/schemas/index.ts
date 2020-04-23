import { gql } from 'apollo-server-express'
import {
  URLTypeDefinition,
  EmailAddressTypeDefinition,
  PhoneNumberTypeDefinition,
  PositiveIntTypeDefinition,
  DateTimeTypeDefinition
} from 'graphql-scalars'

import userSchema from './user'
import category from './category'
import recipeSource from './recipeSource'
import account from './account'
import recipe from './recipe'
import notification from './notification'
import comment from './comment'
import recipeCollection from './recipeCollection'
import abuseReport from './abuseReport'
import shoppingListItem from './shoppingListItem'
import common from './common'
import follower from './followership'
import search from './search'
import filter from './filter'
import savedRecipe from './savedRecipe'

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export default [
  linkSchema,
  common,
  userSchema,
  category,
  recipeSource,
  ...account,
  ...recipe,
  notification,
  ...comment,
  recipeCollection,
  ...shoppingListItem,
  abuseReport,
  follower,
  search,
  filter,
  savedRecipe,
  // custom scalars
  EmailAddressTypeDefinition,
  PhoneNumberTypeDefinition,
  PositiveIntTypeDefinition,
  DateTimeTypeDefinition,
  URLTypeDefinition as any
]
