import gql from 'graphql-tag'

export const GET_ACCOUNTS = gql`
  query accounts($first: Int, $after: String, $last: Int, $before: String) {
    accounts(first: $first, after: $after, last: $last, before: $before) {
      nodes {
        id
        allergies
      }
      totalCount
    }
  }
`

export const ME = gql`
  query me {
    me {
      id
      allergies
    }
  }
`
