import mongoose from 'mongoose'

export type NutrientDocument = mongoose.Document & {
  name: string
  code: string
}

const nutrientSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  code: { type: String, required: 'Code is mandatory' }
})

export const Nutrient = mongoose.model<NutrientDocument>(
  'Nutrient',
  nutrientSchema
)
