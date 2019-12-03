import { AuthenticationError } from 'apollo-server-express'
import { userService, authService } from '../../services'

export default {
  Query: {
    user: async (parent, { id }, { userId, error }) => {
      if (!userId) throw new AuthenticationError('You are not authenticated')

      if (error) throw error

      return userService.getUser(id)
    },
    getAccessToken: async (parent, { authToken }) => {
      return authService.getAccessToken(authToken)
    }
  },
  Mutation: {
    register: async (parent, { email, password }) => {
      return authService.register({ email, password })
    }
  }
}
