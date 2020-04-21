import { gql } from 'apollo-server-express'

export default gql`
  #################################################
  #              MUTATION PAYLOADS
  #################################################

  type AddShoppingListItemPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    shoppingListItem: ShoppingListItem
  }

  type AddShoppingListItemsPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    shoppingListItems: [ShoppingListItem]!
  }

  type UpdateShoppingListItemPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    shoppingListItem: ShoppingListItem
  }

  type DeleteShoppingListItemPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    shoppingListItem: ShoppingListItem
  }

  type ClearCheckedItemsPayload {
    code: String!
    success: Boolean!
    """
    True if all checked items are deleted, false otherwise. If it returns 'false', may be
    some items are delected, look at the 'deletedCount' field to take the apropriated action
    """
    message: String!
    clientMutationId: String
    "The number of items deleted"
    deletedCount: Int!
  }

  type ClearShoppingListPayload {
    code: String!
    """
    True if all items are deleted, false otherwise. If it returns 'false', may be some
    items are delected, look at the 'deletedCount' field to take the apropriated action
    """
    success: Boolean!
    message: String!
    clientMutationId: String
    "The number of items deleted"
    deletedCount: Int!
  }

  #################################################
  #                 MUTATIONS
  #################################################

  extend type Mutation {
    addShoppingListItem(
      input: AddShoppingListItemInput!
    ): AddShoppingListItemPayload! @auth
    addShoppingListItems(
      input: AddShoppingListItemsInput!
    ): AddShoppingListItemsPayload! @auth
    updateShoppingListItem(
      input: UpdateShoppingListItemInput!
    ): UpdateShoppingListItemPayload! @auth
    deleteShoppingListItem(
      input: DeleteShoppingListItemInput!
    ): DeleteShoppingListItemPayload! @auth
    "Clear checked items in the shoppinglist"
    clearCheckedItems(
      input: ClearCheckedItemsInput!
    ): ClearCheckedItemsPayload! @auth
    "Clear all items in the shoppinglist"
    clearShoppingList(
      input: ClearShoppingListInput!
    ): ClearShoppingListPayload! @auth
  }
`
