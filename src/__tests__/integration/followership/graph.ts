import gql from 'graphql-tag'

export const ME = gql`
  query me($first: Int, $after: String, $last: Int, $before: String) {
    me {
      id
      allergies
      followers(first: $first, after: $after, last: $last, before: $before) {
        nodes {
          id
          allergies
        }
        totalCount
      }
      following(first: $first, after: $after, last: $last, before: $before) {
        nodes {
          ... on Account {
            id
            allergies
          }
        }
        totalCount
      }
    }
  }
`

export const FOLLOW = gql`
  mutation follow($input: FollowInput!) {
    follow(input: $input) {
      code
      success
      message
      clientMutationId
      me {
        id
        allergies
      }
      following {
        ... on Account {
          id
          allergies
        }
      }
    }
  }
`

export const UNFOLLOW = gql`
  mutation unfollow($input: UnfollowInput!) {
    unfollow(input: $input) {
      code
      success
      message
      clientMutationId
      me {
        id
        allergies
      }
      following {
        ... on Account {
          id
          allergies
        }
      }
    }
  }
`
