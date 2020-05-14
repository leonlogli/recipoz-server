/* eslint-disable quotes */
import { expect } from 'chai'
import { getIngredientCategory } from '../../services/shoppingList'

describe('ingredient ctegory handler', () => {
  it('should return the right category for unkown ingredients', () => {
    expect(getIngredientCategory('unknown ingredient.')).to.equal('OTHER')
  })

  describe('french ingredients process', () => {
    it('should properly return the spices category', () => {
      expect(getIngredientCategory('sel')).to.equal('HERBS_AND_SPICES')
    })

    it('should properly return the fruits category', () => {
      expect(getIngredientCategory('piment')).to.equal('FRUITS_AND_VEGETABLES')
    })

    it('should properly return the dairy category', () => {
      expect(getIngredientCategory('lait')).to.equal('DAIRY')
    })
  })

  describe('english ingredients process', () => {
    it('should properly return the spices category', () => {
      expect(getIngredientCategory('salt')).to.equal('HERBS_AND_SPICES')
    })

    it('should properly return the dairy category', () => {
      expect(getIngredientCategory('egg')).to.equal('DAIRY')
    })

    it('should properly return the fruits category', () => {
      expect(getIngredientCategory('tomato')).to.equal('FRUITS_AND_VEGETABLES')
    })
  })

  describe('Complex english ingredient phrase process', () => {
    it('should properly return the fruits category', () => {
      expect(getIngredientCategory('1 cup mashed potatoes')).to.equal(
        'FRUITS_AND_VEGETABLES'
      )
    })

    it('should properly return the condiment category', () => {
      expect(getIngredientCategory('1 tablespoon olive oil')).to.equal(
        'CONDIMENTS'
      )
    })

    it('should properly return the fruits category', () => {
      expect(getIngredientCategory('2 cups long-grain white rice')).to.equal(
        'PASTA_RICE_AND_BEANS'
      )
    })

    it('should properly return the fruits category', () => {
      expect(getIngredientCategory('can chopped tomatoes')).to.equal(
        'CANNED_FOODS'
      )
    })
  })

  describe('Complex french ingredient phrase process', () => {
    it('should properly return the fruits category', () => {
      const res = getIngredientCategory('1 tasse de purée de pommes de terre')

      expect(res).to.equal('FRUITS_AND_VEGETABLES')
    })

    it('should properly return the condiment category', () => {
      const res = getIngredientCategory("1 cuillère à soupe d'huile d'olive")

      expect(res).to.equal('CONDIMENTS')
    })

    it('should properly return the fruits category', () => {
      const res = getIngredientCategory('2 tasses de riz blanc à grain long')

      expect(res).to.equal('PASTA_RICE_AND_BEANS')
    })

    it('should properly return the fruits category', () => {
      const res = getIngredientCategory('tomates en boîte hachées')

      expect(res).to.equal('CANNED_FOODS')
    })
  })
})
