import mongoose from 'mongoose'

export type UtensilDocument = mongoose.Document & {
  name: string
  description?: string
  image: string
}

const utensilSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  description: String,
  image: { type: String, required: 'Image is mandatory' }
})

export const Utensil = mongoose.model<UtensilDocument>('Utensil', utensilSchema)
