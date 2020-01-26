import { gql } from 'apollo-server-express'

export default gql`
  type Comment {
    id: ID!
    user: Account!
    onData: ComentData!
    content: String
    attachmentUrl: String
    rating: Float
    inReplyTo: Comment
    reactions: [CommentReaction!]
    mentionedUsers: [Account!]
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
    user: Account!
  }

  input CommentInput {
    user: ID!
    onData: ID!
    content: String
    attachmentUrl: String
    rating: Float
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    comment(id: ID!): Comment!
    comments: [Comment!]!
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
