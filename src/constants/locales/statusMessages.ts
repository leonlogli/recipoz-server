import { withNamespace } from '../../utils'

const statusMessages = {
  category: {
    created: 'category.created',
    updated: 'category.updated',
    deleted: 'category.deleted'
  },
  measureUnit: {
    created: 'measureUnit.created',
    updated: 'measureUnit.updated',
    deleted: 'measureUnit.deleted'
  },
  nutrient: {
    created: 'nutrient.created',
    updated: 'nutrient.updated',
    deleted: 'nutrient.deleted'
  },
  source: {
    created: 'source.created',
    updated: 'source.updated',
    deleted: 'source.deleted'
  },
  account: {
    created: 'account.created',
    updated: 'account.updated',
    deleted: 'account.deleted',
    tokenRevoked: 'account.tokenRevoked'
  },
  recipe: {
    created: 'recipe.created',
    updated: 'recipe.updated',
    deleted: 'recipe.deleted'
  }
}

export default withNamespace(statusMessages, 'statusMessages')
