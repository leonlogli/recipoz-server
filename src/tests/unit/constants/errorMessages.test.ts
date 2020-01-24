import { expect } from 'chai'
import { errorMessages } from '../../../constants'

describe('isString test', () => {
  it('should dotify object', () => {
    expect(errorMessages).to.eql({
      category: {
        nameIsMandatory: 'categoryNameIsMandatory',
        thumbnailIsMandatory: 'categoryThumbnailIsMandatory',
        notFound: 'categoryNotFound',
        updateNotFound: 'categoryToUpdateNotFound',
        deleteNotFound: 'categoryToDeleteNotFound'
      },
      ingredient: {
        nameIsMandatory: 'ingredientNameIsMandatory',
        imageIsMandatory: 'ingredientImageIsMandatory',
        notFound: 'ingredientNotFound',
        updateNotFound: 'ingredientToUpdateNotFound',
        deleteNotFound: 'ingredientToDeleteNotFound'
      },
      measureUnit: {
        nameIsMandatory: 'measureUnitNameIsMandatory',
        notFound: 'measureUnitNotFound',
        updateNotFound: 'measureUnitToUpdateNotFound',
        deleteNotFound: 'measureUnitToDeleteNotFound'
      },
      utensil: {
        nameIsMandatory: 'measureUnitNameIsMandatory',
        imageIsMandatory: 'utensilImageIsMandatory',
        notFound: 'measureUnitNotFound',
        updateNotFound: 'measureUnitToUpdateNotFound',
        deleteNotFound: 'measureUnitToDeleteNotFound'
      },
      nutrient: {
        nameIsMandatory: 'nutrientNameIsMandatory',
        codeIsMandatory: 'nutrientCodeIsMandatory',
        notFound: 'nutrientNotFound',
        updateNotFound: 'nutrientToUpdateNotFound',
        deleteNotFound: 'nutrientToDeleteNotFound'
      }
    })
  })
})
