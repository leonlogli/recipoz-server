import { expect } from 'chai'
import { errorMessages } from '../../../../constants/locales'

describe('constants > locale', () => {
  it('should prepend namespace to i18n keys', () => {
    expect(errorMessages).to.deep.include({
      forbidden: 'errorMessages:forbidden',
      comment: {
        notFound: 'errorMessages:commentNotFound'
      }
    })
  })
})
