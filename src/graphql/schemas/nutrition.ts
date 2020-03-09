import { gql } from 'apollo-server-express'

export default gql`
  type Nutrition {
    calories: Float
    fat: Float
    saturatedFat: Float
    transFat: Float
    cholesterol: Float
    sodium: Float
    carbs: Float
    dietaryFiber: Float
    sugars: Float
    protein: Float
    potassium: Float
    vitA: Float
    vitC: Float
    calcium: Float
    iron: Float
  }
`
