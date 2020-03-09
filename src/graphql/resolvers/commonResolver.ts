import { Context } from '..'
import { hasOwnProperties } from '../../utils'

export default {
  MutationResponse: {
    __resolveType(mutationResponse: any, _context: Context) {
      if (hasOwnProperties(mutationResponse, 'recipe')) {
        return 'RecipeMutationResponse'
      }

      if (hasOwnProperties(mutationResponse, 'category')) {
        return 'CategoryMutationResponse'
      }

      if (hasOwnProperties(mutationResponse, 'recipeSource')) {
        return 'RecipeSourceMutationResponse'
      }

      if (hasOwnProperties(mutationResponse, 'recipeSource')) {
        return mutationResponse.me
          ? 'RecipeSourceMutationResponse'
          : 'RecipeSourceMutationResponse'
      }

      if (hasOwnProperties(mutationResponse, 'account')) {
        return mutationResponse.me
          ? 'FollowAccountMutationResponse'
          : 'AccountMutationResponse'
      }

      return null
    }
  }
}
