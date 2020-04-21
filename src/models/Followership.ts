import mongoose, { Document, Schema } from 'mongoose'

import { AccountDocument } from './Account'
import { CategoryDocument } from './Category'
import { RecipeSourceDocument } from './RecipeSource'

export type FollowershipDocument = Document & {
  follower: AccountDocument
  followedData: AccountDocument | CategoryDocument | RecipeSourceDocument
  followedDataType: FollowedDataType
}

const { ObjectId } = Schema.Types

export const followedDataTypes = [
  'Account',
  'RecipeSource',
  'Category'
] as const

export type FollowedDataType = typeof followedDataTypes[number]

const followershipSchema = new Schema({
  follower: { type: ObjectId, ref: 'Account' },
  followedData: { type: ObjectId, refPath: 'followedDataType' },
  followedDataType: { type: String, enum: followedDataTypes }
})

followershipSchema.index({ followedData: 1, followedDataType: 1 })

followershipSchema.index({ follower: 1 })

export const Followership = mongoose.model<FollowershipDocument>(
  'Followership',
  followershipSchema
)
export default Followership
