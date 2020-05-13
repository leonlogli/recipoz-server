import { gql } from 'apollo-server-express'

export default gql`
  type Comment implements Node {
    id: ID! @guid
    author: Account!
    topic: CommentTopic!
    content: String!
    attachmentUrl: String
    rating: CommentRating
    taggedAccounts: [Account!]!
    createdAt: DateTime!
    updatedAt: DateTime
    replies(
      first: Int
      after: String
      last: Int
      before: String
    ): CommentConnection!
    likedBy(
      first: Int
      after: String
      last: Int
      before: String
    ): AccountConnection!
  }

  type CommentEdge {
    cursor: String!
    node: Comment!
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    nodes: [Comment!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum CommentOrderBy {
    DATE_ASC
    DATE_DESC
    RATING_ASC
    RATING_DESC
  }

  enum CommentRating {
    "1 Star"
    ONE
    "2 Star"
    TWO
    "3 Star"
    THREE
    "4 Star"
    FOUR
    "5 Star"
    FIVE
  }

  type RatingSummary {
    "Rating total count"
    totalCount: Int
    "Number of account that rated the post with 1 star"
    one: Int!
    "Number of account that rated the post with 2 star"
    two: Int!
    "Number of account that rated the post with 3 star"
    three: Int!
    "Number of account that rated the post with 4 star"
    four: Int!
    "Number of account that rated the post with 5 star"
    five: Int!
    "Rating average"
    average: Int
  }

  union CommentTopic = Recipe | Comment
`
