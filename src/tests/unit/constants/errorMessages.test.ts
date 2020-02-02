import { expect } from 'chai'
import { errorMessages } from '../../../constants'

describe('isString test', () => {
  it('should dotify object', () => {
    expect(errorMessages).to.eql({
      forbidden: 'forbidden',
      unauthenticated: 'unauthenticated',
      accessDenied: 'accessDenied',
      internalServerError: 'internalServerError',
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
      },
      source: {
        nameIsMandatory: 'sourceNameIsMandatory',
        websiteIsMandatory: 'sourceWebsiteIsMandatory',
        notFound: 'sourceNotFound',
        updateNotFound: 'sourceToUpdateNotFound',
        deleteNotFound: 'sourceToDeleteNotFound'
      },
      account: {
        userIdIsMandatory: 'userIdIsMandatory',
        notFound: 'accountNotFound',
        updateNotFound: 'accountToUpdateNotFound',
        deleteNotFound: 'accountToDeleteNotFound',
        emailAlreadyExists: 'emailAlreadyExists',
        phoneNumberAlreadyExists: 'phoneNumberAlreadyExists',
        invalidEmail: 'invalidEmail',
        invalidPhoneNumber: 'invalidPhoneNumber',
        invalidPhotoURL: 'invalidPhotoURL',
        invalidDisplayName: 'invalidDisplayName',
        invalidPassword: 'invalidPassword',
        userNotFound: 'userNotFound',
        cannotFollowYourself: 'cannotFollowYourself'
      }
    })
  })
})
