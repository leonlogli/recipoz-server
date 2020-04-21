import { gql } from 'apollo-server-express'

export default gql`
  input ShoppingListItemInput {
    "Item name (e.g. potato)"
    name: String!
    "Item quantity (e.g. 2g, 3-1/2 ml)"
    quantity: String
  }

  input AddShoppingListItemsInput {
    "ID of the recipe these items belong to"
    recipe: ID!
    "List of items to add"
    items: [ShoppingListItemInput!]!
    clientMutationId: String
  }

  input AddShoppingListItemInput {
    "ID of the recipe this item belong to"
    recipe: ID
    "Item name (e.g. potato)"
    name: String!
    "Item quantity (e.g. 2g, 3-1/2 ml)"
    quantity: String
    clientMutationId: String
  }

  input UpdateShoppingListItemInput {
    id: ID!
    "Item name (e.g. potato)"
    name: String
    "Item quantity (e.g. 2g, 3-1/2 ml)"
    quantity: String
    category: ShoppingListItemCategory
    checked: Boolean
    clientMutationId: String
  }

  input DeleteShoppingListItemInput {
    "ID of the shoppingList Item to delete"
    id: ID!
    clientMutationId: String
  }

  input ClearCheckedItemsInput {
    clientMutationId: String
  }

  input ClearShoppingListInput {
    clientMutationId: String
  }

  input ShoppingListItemFilter {
    recipe: ID
    category: ShoppingListItemCategory
  }
`
