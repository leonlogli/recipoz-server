import { expect } from 'chai'
import { getIngredientCategory } from '../../../utils/ingredientDataHelper'

describe('utils > ingredientDataHelper', () => {
  it('should get ingredient category', () => {
    console.time('getIngredientCategory')

    console.timeEnd('getIngredientCategory')
    expect(getIngredientCategory('salt')).to.equal('HERBS_AND_SPICES')
    expect(getIngredientCategory('piment')).to.equal('FRUITS_AND_VEGETABLES')
    expect(getIngredientCategory('egg')).to.equal('DAIRY')
    expect(getIngredientCategory('lait')).to.equal('DAIRY')
    expect(getIngredientCategory('tomato')).to.equal('FRUITS_AND_VEGETABLES')
    expect(getIngredientCategory('tomates')).to.equal('FRUITS_AND_VEGETABLES')
  })
})
