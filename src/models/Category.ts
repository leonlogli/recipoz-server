import mongoose from 'mongoose'

const subCategories = [
  'MEAL_TYPE',
  'DIET',
  'DISH_TYPE',
  'SEASONAL',
  'COOKING_STYLE',
  'HEALTH',
  'CUISINE'
] as const

export type CategoryDocument = mongoose.Document & {
  subCategory: {
    type: typeof subCategories[number]
    thumbnail?: string
  }
  name: string
  description?: string
  thumbnail: string
}

const categorySchema = new mongoose.Schema({
  subCategory: {
    type: { type: String, enum: subCategories, unique: true },
    thumbnail: String
  },
  name: { type: String, required: 'Name is mandatory', unique: true },
  description: String,
  thumbnail: { type: String, required: 'Thumbnail is mandatory' }
})

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
export default Category
