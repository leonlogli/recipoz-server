import { gql } from 'apollo-server-express'

export default gql`
  input IngredientInput {
    quantity: String
    name: String!
    group: String
  }

  input InstructionInput {
    text: String!
    image: String
  }

  input AddRecipeInput {
    name: String!
    description: String
    image: String!
    servings: Int!
    "Recipe source. Only admin can specity it"
    source: ID
    "The url of the original recipe. Required when source is specified"
    originalLink: String
    "Cooking time in minutes. Optional if prepTime is specified"
    cookTime: Int
    "Prep time in minutes. Optional if cookTime is specified"
    prepTime: Int
    "Recipe directions. At least one Instruction is required"
    instructions: [InstructionInput!]!
    "At least two categories are required"
    categories: [ID!]!
    "Recipe ingredients.  At least one ingredient is required"
    ingredients: [IngredientInput!]!
    private: Boolean
    difficultyLevel: DifficultyLevel
    cost: Cost
    additionalImages: [String!]
    tips: String
    clientMutationId: String
  }

  input UpdateRecipeInput {
    id: ID!
    name: String
    description: String
    image: String
    servings: Int
    "Recipe source. Only admin can specity it"
    source: ID
    "The url of the original recipe. Required when source is specified"
    originalLink: String
    "Cooking time in minutes. Optional if prepTime is specified"
    cookTime: Int
    "Prep time in minutes. Optional if cookTime is specified"
    prepTime: Int
    "Recipe directions. At least one Instruction is required"
    instructions: [InstructionInput!]
    "At least two categories are required"
    categories: [ID!]
    "Recipe ingredients.  At least one ingredient is required"
    ingredients: [IngredientInput!]
    private: Boolean
    difficultyLevel: DifficultyLevel
    cost: Cost
    additionalImages: [String!]
    tips: String
    clientMutationId: String
  }

  input DeleteRecipeInput {
    "ID of the recipe to delete"
    id: ID!
    clientMutationId: String
  }

  input InstructionFilter {
    text: StringFilter
  }

  input IngredientFilter {
    name: StringFilter
  }

  input RecipeFilter {
    or: [RecipeFilter!]
    and: [RecipeFilter!]
    nor: [RecipeFilter!]
    name: OrderByStringFilter
    servings: NumFilter
    source: IDFilter
    description: StringFilter
    cookTime: NumFilter
    prepTime: NumFilter
    instructions: InstructionFilter
    categories: IDFilter
    ingredients: IngredientFilter
    private: BooleanFilter
    difficultyLevel: StringFilter
    cost: StringFilter
    tips: StringFilter
  }
`
