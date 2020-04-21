import { gql } from 'apollo-server-express'

export default gql`
  #################################################
  #              MUTATION PAYLOADS
  #################################################

  type AddCommentPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  type UpdateCommentPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  type DeleteCommentPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  type CommentPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  type LikePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  type UnLikePayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    comment: Comment
  }

  #################################################
  #                 MUTATIONS
  #################################################

  extend type Mutation {
    addComment(input: AddCommentInput!): AddCommentPayload!
    updateComment(input: UpdateCommentInput!): UpdateCommentPayload!
    deleteComment(input: DeleteCommentInput!): DeleteCommentPayload!
    like(input: LikeInput!): LikePayload! @auth
    unlike(input: UnLikeInput!): UnLikePayload! @auth
  }
`
