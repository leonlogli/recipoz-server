import { gql } from 'apollo-server-express'

export default gql`
  type Pageable {
    page: Int
    size: Int
  }

  input PageableInput {
    page: Int
    size: Int
  }
`
