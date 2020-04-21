import { withNamespace } from '../../utils'

const statusMessages = {
  category: {
    created: 'category.created',
    updated: 'category.updated',
    deleted: 'category.deleted'
  },
  recipeSource: {
    created: 'recipeSource.created',
    updated: 'recipeSource.updated',
    deleted: 'recipeSource.deleted'
  },
  account: {
    created: 'account.created',
    updated: 'account.updated',
    deleted: 'account.deleted',
    follow: 'account.follow',
    unfollow: 'account.unfollow',
    tokenRevoked: 'account.tokenRevoked'
  },
  recipe: {
    created: 'recipe.created',
    updated: 'recipe.updated',
    deleted: 'recipe.deleted'
  },
  recipeCollection: {
    created: 'recipeCollection.created',
    updated: 'recipeCollection.updated',
    deleted: 'recipeCollection.deleted'
  },
  accountRecipe: {
    addedToFavorite: 'recipe.addedToFavorite',
    removedFromFavorite: 'recipe.removedFromFavorite',
    addedToMade: 'recipe.addedToMade',
    removedFromMade: 'recipe.removedFromMade',
    addedToCollection: 'recipe.addedToCollection',
    removedFromCollection: 'recipe.removedFromCollection'
  },
  shoppingListItem: {
    added: 'shoppingListItem.added',
    updated: 'shoppingListItem.updated',
    deleted: 'shoppingListItem.deleted'
  },
  comment: {
    created: 'comment.created',
    updated: 'comment.updated',
    deleted: 'comment.deleted',
    like: 'comment.like'
  },
  abuseReport: {
    created: 'abuseReport.created',
    updated: 'abuseReport.updated',
    deleted: 'abuseReport.deleted'
  },
  notification: {
    updated: 'notification.updated',
    deleted: 'notification.deleted'
  }
}

export default withNamespace(statusMessages, 'statusMessages')
