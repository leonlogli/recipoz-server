import { gql } from 'apollo-server-express'

import userSchema from './user'
import category from './category'
import recipeSource from './recipeSource'
import account from './account'
import recipe from './recipe'
import notification from './notification'
import tracking from './tracking'
import comment from './comment'
import nutrition from './nutrition'
import common from './common'

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
  account,
  recipe,
  notification,
  tracking,
  nutrition,
  comment
]
