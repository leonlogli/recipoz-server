import { gql } from 'apollo-server-express'

export default gql`
  type Comment {
    id: ID!
    user: UserAccount!
    on: ComentData!
    content: String!
    attachmentUrl: String
    rating: Float
    replies: [Comment!]
    reactions: [CommentReaction!]
    mentionedUsers: [UserAccount!]
    totalReplies: Float
    totalReactions: Float
  }

  union ComentData = Category | Recipe

  enum CommentReactionType {
    LIKE
    LOVE
    APPLAUD
    LAUGH
    CONFUSED
  }

  type CommentReaction {
    type: CommentReactionType!
    user: UserAccount!
  }

  input CommentInput {
    user: ID!
    on: ID!
    content: String
    attachmentUrl: String
    rating: Float
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    comment(id: ID!): Comment!
    categories: [Comment!]!
  }

  extend type Mutation {
    addComment(comment: CommentInput): Comment!
    updateComment(id: ID!, comment: CommentInput): Comment!
    reactToComent(id: ID!, user: ID!, reaction: CommentReactionType): Comment!
    deleteComment(id: ID!): ID!
    deleteCommentReaction(id: ID!, user: ID!): Comment!
    mentionUsersInComment(id: ID!, users: [ID!]!): Comment!
    replyToComment(parentComment: ID!, comment: CommentInput): Comment!
  }
`
