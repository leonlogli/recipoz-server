import { expect } from 'chai'
import { errorMessages } from '../../../constants'

describe('isString test', () => {
  it('should dotify object', () => {
    expect(errorMessages).to.eql({
      category: {
        nameIsMandatory: 'categoryNameIsMandatory',
        notFound: 'categoryNotFound',
        updateNotFound: 'categoryToUpdateNotFound',
        deleteNotFound: 'categoryToDeleteNotFound'
      },
      ingredient: {
        nameIsMandatory: 'ingredientNameIsMandatory',
        notFound: 'ingredientNotFound',
        updateNotFound: 'ingredientToUpdateNotFound',
        deleteNotFound: 'ingredientToDeleteNotFound'
      },
      measureUnit: {
        nameIsMandatory: 'measureUnitNameIsMandatory',
        notFound: 'measureUnitNotFound',
        updateNotFound: 'measureUnitToUpdateNotFound',
        deleteNotFound: 'measureUnitToDeleteNotFound'
      }
    })
  })
})
