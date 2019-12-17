import { gql } from 'apollo-server-express'

import userSchema from './user'
import category from './category'
import global from './global'

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export default [linkSchema, global, userSchema, category]
