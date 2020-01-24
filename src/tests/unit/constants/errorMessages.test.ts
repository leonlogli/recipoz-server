import { expect } from 'chai'
import { errorMessages } from '../../../constants'

describe('isString test', () => {
  it('should dotify object', () => {
    expect(errorMessages).to.eql({
      categoryNameIsMandatory: 'categoryNameIsMandatory',
      categoryNotFound: 'categoryNotFound',
      categoryToUpdateNotFound: 'categoryToUpdateNotFound',
      categoryToDeleteNotFound: 'categoryToDeleteNotFound',
      ingredientNameIsMandatory: 'ingredientNameIsMandatory',
      ingredientNotFound: 'ingredientNotFound',
      ingredientToDeleteNotFound: 'ingredientToDeleteNotFound',
      ingredientToUpdateNotFound: 'ingredientToUpdateNotFound'
    })
  })
})
