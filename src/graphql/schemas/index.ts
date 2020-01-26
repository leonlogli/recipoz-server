import { gql } from 'apollo-server-express'

import userSchema from './user'
import category from './category'
import ingredient from './ingredient'
import measureUnit from './measureUnit'
import utensil from './utensil'
import nutrient from './nutrient'
import source from './source'
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
  ingredient,
  measureUnit,
  utensil,
  nutrient,
  source,
  account,
  recipe,
  notification,
  tracking,
  nutrition,
  comment
]
