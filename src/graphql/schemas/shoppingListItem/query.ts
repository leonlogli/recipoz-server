import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    shoppingList(
      account: ID!
      filter: ShoppingListItemFilter
      first: Int
      after: String
      last: Int
      before: String
    ): ShoppingListItemConnection!
    myShoppingList(
      filter: ShoppingListItemFilter
      first: Int
      after: String
      last: Int
      before: String
    ): ShoppingListItemConnection! @auth
  }
`
