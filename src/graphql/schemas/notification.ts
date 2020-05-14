import { gql } from 'apollo-server-express'

export default gql`
  type Notification implements Node {
    id: ID! @guid
    text: String!
    code: NotificationCode!
    actors: [NotificationActor!]!
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

  union NotificationActor = Account | RecipeSource

  enum NotificationCode {
    COMMENTS
    TAGS
    LIKES
    NEW_FOLLOWERS
    RECIPES
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

  type MarkAllNotificationsAsReadPayload {
    code: String!
    "Returns true if 'mutatedCount' > 0, false otherwise"
    success: Boolean!
    message: String!
    clientMutationId: String
    "Number of notification mutated (which are successfully mark as read)"
    mutatedCount: Int
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

  input MarkAllNotificationsAsReadInput {
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
    markAllNotificationsAsRead(
      input: MarkAllNotificationsAsReadInput!
    ): MarkAllNotificationsAsReadPayload! @auth
    deleteNotification(
      input: DeleteNotificationInput!
    ): DeleteNotificationPayload! @auth
  }
`
