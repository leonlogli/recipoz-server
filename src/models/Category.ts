import mongoose from 'mongoose'

export type CategoryDocument = mongoose.Document & {
  name: string
  description: string
  thumbnail: string
}

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  thumbnail: String
})

export const Category = mongoose.model<CategoryDocument>(
  'Category',
  categorySchema
)
