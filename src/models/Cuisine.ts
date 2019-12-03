import mongoose from 'mongoose'

export type CuisineDocument = mongoose.Document & {
  name: string
  description?: string
  thumbnail?: string
}

const cuisineSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  description: String,
  thumbnail: String
})

export const Cuisine = mongoose.model<CuisineDocument>('Cuisine', cuisineSchema)
