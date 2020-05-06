import { gql } from 'apollo-server-express'

export default gql`
  type Notification implements Node {
    id: ID! @guid
    code: NotificationCode!
    actor: Account!
    recipient: Account!
    data: NotificationData!
    read: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type NotificationEdge {
    cursor: String!
    node: Notification!
  }

  type NotificationConnection {
    edges: [NotificationEdge!]!
    nodes: [Notification!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  union NotificationData = Comment | Recipe | Account

  enum NotificationCode {
    MY_RECIPE_IS_COMMENTED
    SOMEONE_REPLIED_TO_MY_COMMENT
    SOMEONE_MENTIONED_ME
    MY_COMMENT_IS_LIKED
    SOMEONE_STARTED_FOLLOWING_ME
    NEW_RECIPE_FROM_MY_FOLLOWING
  }

  enum NotificationType {
    "Push notification"
    PUSH
    "Email notification"
    EMAIL
  }

  input NotificationFilter {
    or: [NotificationFilter!]
    and: [NotificationFilter!]
    nor: [NotificationFilter!]
    code: StringFilter
    read: BooleanFilter
  }

  type UpdateNotificationPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    notification: Notification
  }

  type DeleteNotificationPayload {
    code: String!
    success: Boolean!
    message: String!
    clientMutationId: String
    notification: Notification
  }

  input UpdateNotificationInput {
    id: ID!
    read: Boolean
    clientMutationId: String
  }

  input DeleteNotificationInput {
    "ID of the notification to delete"
    id: ID!
    clientMutationId: String
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    myNotifications(
      filter: NotificationFilter
      first: Int
      after: String
      last: Int
      before: String
    ): NotificationConnection! @auth
  }

  extend type Mutation {
    updateNotification(
      input: UpdateNotificationInput!
    ): UpdateNotificationPayload! @auth
    deleteNotification(
      input: DeleteNotificationInput!
    ): DeleteNotificationPayload! @auth
  }
`
