import { gql } from 'apollo-server-express'

import userSchema from './user'
import category from './category'
import common from './common'

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export default [linkSchema, common, userSchema, category]
