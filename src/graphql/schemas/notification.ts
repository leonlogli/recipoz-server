import { gql } from 'apollo-server-express'

export default gql`
  type Notification {
    id: ID!
    type: NotificationType!
    actor: UserAccount!
    me: UserAccount!
    data: NotificationData!
    unread: Boolean!
  }

  union NotificationData = Comment | Recipe

  enum NotificationType {
    MY_RECIPE_IS_COMMENTED
    SOMEONE_REPLIED_TO_MY_COMMENT
    I_AM_MENTIONED_IN_COMMENT
    SOMEONE_REACTED_TO_MY_COMMENT
    I_HAVE_NEW_FOLLOWER
    MY_FOLLOWER_PUBLISHES_RECIPE
  }

  input NotificationInput {
    data: ID
    me: ID!
    type: NotificationType!
    actor: UserAccount!
    unread: Boolean
  }

  #################################################
  #      QUERY, MUTATION & SUBSCRIBTION
  #################################################

  extend type Query {
    notification(id: ID!): Notification!
    notifications: [Notification!]!
  }

  extend type Mutation {
    addNotification(notification: NotificationInput): Notification!
    updateNotification(id: ID!, notification: NotificationInput): Notification!
    deleteNotification(id: ID!): ID!
  }
`
