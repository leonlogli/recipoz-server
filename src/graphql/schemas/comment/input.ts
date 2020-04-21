import { gql } from 'apollo-server-express'

export default gql`
  input AddCommentInput {
    topic: ID!
    content: String!
    attachmentUrl: String
    rating: CommentRating
    "IDs of mentioned accounts. Up to 50"
    mentionedAccounts: [ID!]
    clientMutationId: String
  }

  input UpdateCommentInput {
    id: ID!
    content: String
    attachmentUrl: String
    rating: CommentRating
    "IDs of mentioned accounts. Up to 50"
    mentionedAccounts: [ID!]
    clientMutationId: String
  }

  input DeleteCommentInput {
    "ID of the comment to delete"
    id: ID!
    clientMutationId: String
  }

  input LikeInput {
    comment: ID!
    clientMutationId: String
  }

  input UnLikeInput {
    comment: ID!
    clientMutationId: String
  }

  input CommentFilter {
    topic: ID!
  }
`
