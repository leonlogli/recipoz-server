import Joi, { required } from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { objectIdSchema, idSchema } from './common.validation'
import { commentTopics } from '../models'

const commentSchema = Joi.object({
  id: idSchema,
  author: objectIdSchema.required(),
  content: Joi.string()
    .min(3)
    .max(280)
    .when('$isNew', { is: true, then: required() }),
  rating: Joi.number().valid(1, 2, 3, 4, 5),
  topic: objectIdSchema.when('$isNew', { is: true, then: required() }),
  topicType: Joi.string()
    .valid(...commentTopics)
    .when('$isNew', { is: true, then: required() }),
  attachmentUrl: Joi.string().uri(),
  mentionedAccounts: Joi.array()
    .items(objectIdSchema.required())
    .min(1)
    .min(50)
    .unique()
})

const validateComment = (data: any, isNew = true) => {
  const { clientMutationId: _, ...comment } = data

  const { error, value } = commentSchema.validate(comment, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

const validateCommentReaction = (data: any) => {
  const { clientMutationId: _, ...reaction } = data

  const reactionSchema = Joi.object({
    comment: objectIdSchema.required(),
    account: objectIdSchema.required()
  })

  const { error, value } = reactionSchema.validate(reaction, {
    abortEarly: false
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateComment, validateCommentReaction }
