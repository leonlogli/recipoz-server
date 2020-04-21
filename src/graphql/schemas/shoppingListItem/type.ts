import { gql } from 'apollo-server-express'

export default gql`
  type ShoppingListItem implements Node {
    id: ID! @guid
    account: Account!
    recipe: Recipe
    "Item name (e.g. potato)"
    name: String!
    "Item quantity (e.g. 2g, 3-1/2 ml)"
    quantity: String
    category: ShoppingListItemCategory!
    checked: Boolean!
  }

  type ShoppingListItemEdge {
    cursor: String!
    node: ShoppingListItem!
  }

  type ShoppingListItemConnection {
    edges: [ShoppingListItemEdge!]!
    nodes: [ShoppingListItem!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum ShoppingListItemCategory {
    HERBS_AND_SPICES
    BAKING
    CANNED_FOODS
    CONDIMENTS
    DAIRY
    MEATS_AND_SEAFOOD
    FROZEN_FOODS
    DRINKS
    FRUITS_AND_VEGETABLES
    BREAD_AND_BAKERY
    HOUSEHOLD
    BREAKFAST_FOODS
    PASTA_RICE_AND_BEANS
    SNACK_FOODS
    HEALTH_AND_BEAUTY
    BABY_CARE
    PET_CARE
    OTHER
  }
`
