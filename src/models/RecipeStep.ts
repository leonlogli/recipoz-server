import mongoose from 'mongoose'

export type RecipeStepDocument = mongoose.Document & {
  number: number
  instructions: string
  image?: string
}

const recipeStepSchema = new mongoose.Schema({
  number: { type: Number, required: 'Step number is mandatory' },
  instructions: { type: String, required: 'Instruction is mandatory' },
  image: String
})

export { recipeStepSchema }
