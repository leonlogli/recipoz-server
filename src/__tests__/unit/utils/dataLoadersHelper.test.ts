import { expect } from 'chai'
import {
  dataByQueryLoaderOptions,
  getDataLoaderByModel,
  prime,
  updateDataLoaderCache
} from '../../../utils/dataLoadersHelper'
import { createDataLoaders } from '../../../graphql'

describe('DataLoaders helper', () => {
  it('should be a valid dataloader option', () => {
    expect(dataByQueryLoaderOptions).to.have.ownProperty('cacheKeyFn')
  })

  it('should produce hashable cache key for a given object key', () => {
    const { cacheKeyFn } = dataByQueryLoaderOptions as any

    expect(cacheKeyFn({})).to.be.string
  })

  describe('The DataLoaders instance', () => {
    describe('when initialized', () => {
      const dataloaders = createDataLoaders()

      it('should properly find accountCountLoader by model name', () => {
        const expected = dataloaders.accountLoader

        expect(getDataLoaderByModel('Account', dataloaders)).to.eql(expected)
      })

      it('should properly find userLoader by model name', () => {
        const expected = dataloaders.userLoader

        expect(getDataLoaderByModel('User', dataloaders)).to.eql(expected)
      })

      it('should properly find categoryLoader by model name', () => {
        const expected = dataloaders.categoryLoader

        expect(getDataLoaderByModel('Category', dataloaders)).to.eql(expected)
      })

      it('should properly find recipeLoader by model name', () => {
        const expected = dataloaders.recipeLoader

        expect(getDataLoaderByModel('Recipe', dataloaders)).to.eql(expected)
      })

      it('should properly find recipeSourceLoader by model name', () => {
        const expected = dataloaders.recipeSourceLoader
        const res = getDataLoaderByModel('RecipeSource', dataloaders)

        expect(res).to.eql(expected)
      })

      it('should properly find shoppingListItemLoader by model name', () => {
        const expected = dataloaders.shoppingListItemLoader
        const res = getDataLoaderByModel('ShoppingListItem', dataloaders)

        expect(res).to.eql(expected)
      })

      it('should properly find notificationLoader by model name', () => {
        const expected = dataloaders.notificationLoader
        const res = getDataLoaderByModel('Notification', dataloaders)

        expect(res).to.eql(expected)
      })

      it('should properly find abuseReportLoader by model name', () => {
        const expected = dataloaders.abuseReportLoader
        const res = getDataLoaderByModel('AbuseReport', dataloaders)

        expect(res).to.eql(expected)
      })

      it('should properly find commentLoader by model name', () => {
        const expected = dataloaders.commentLoader

        expect(getDataLoaderByModel('Comment', dataloaders)).to.eql(expected)
      })

      it('should properly find recipeCollectionLoader by model name', () => {
        const expected = dataloaders.recipeCollectionLoader
        const res = getDataLoaderByModel('RecipeCollection', dataloaders)

        expect(res).to.eql(expected)
      })

      it('should return null if no model is provided', () => {
        expect(getDataLoaderByModel('' as any, dataloaders)).to.equal(null)
      })

      it('should properly prime data', async () => {
        const doc: any = { _id: 'fakeObjectId', name: 'Leon' }
        const res = prime(dataloaders.accountLoader, doc)

        expect(await res.load('fakeObjectId')).to.eql(doc)
      })

      it('should properly update dataLoader cache', async () => {
        const doc: any = { _id: 'fakeObjectId', name: 'Leon Logli' }
        const res = updateDataLoaderCache(dataloaders.accountLoader, doc)

        expect(await res.load('fakeObjectId')).to.eql(doc)
      })
    })
  })
})
