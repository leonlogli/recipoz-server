import { expect } from 'chai'
import { errorMessages } from '../../../constants'

describe('isString test', () => {
  it('should dotify object', () => {
    expect(errorMessages).to.eql({
      categoryName: {
        isMandatory: 'categoryName.isMandatory'
      },
      categoryNotFound: 'categoryNotFound'
    })
  })
})
