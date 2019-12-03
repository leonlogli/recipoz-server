import mongoose from 'mongoose'

export type MeasureUnitDocument = mongoose.Document & {
  name: string
  description?: string
}

const measureUnitSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is mandatory' },
  description: String
})

export const MeasureUnit = mongoose.model<MeasureUnitDocument>(
  'MeasureUnit',
  measureUnitSchema
)
