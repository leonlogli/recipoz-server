import { expect } from 'chai'

import {
  isDuplicateError,
  isValidObjectId,
  objectIdFromDateTime,
  removeStopwords,
  toObjectId
} from '../../../../utils/mongoose/docUtils'

describe('Mongoose docs helper', () => {
  it('should convert value to ObjectId', () => {
    const id = toObjectId(1)

    expect(String(id)).to.have.lengthOf(24)
  })

  it('should convert datetime to ObjectId', () => {
    const id = objectIdFromDateTime(Date.now())

    expect(String(id)).to.have.lengthOf(24)
  })

  describe('ObjectId validation', () => {
    it('should return false when a number is passed', () => {
      expect(isValidObjectId(1)).to.be.false
    })

    it('should return false when a string is less than 12 char', () => {
      expect(isValidObjectId('1')).to.be.false
    })

    it('should return false when invalid 12 char string is specified', () => {
      expect(isValidObjectId('123456789101')).to.be.false
    })

    it('should return true when valid object id is specified', () => {
      const validId = toObjectId(1)

      expect(isValidObjectId(validId)).to.be.true
    })
  })

  it('should remove english stop words', () => {
    const res = removeStopwords('i hope you are fine', 'en')

    expect(res).to.equal('hope fine')
  })

  it('should remove french stop words', () => {
    const res = removeStopwords('bonjour tout le monde', 'fr')

    expect(res).to.equal('bonjour monde')
  })

  it('should return true when the error is Mongo duplicate error', () => {
    const error = { name: 'MongoError', code: 11000 }
    const res = isDuplicateError(error)

    expect(res).to.be.true
  })

  it('should return false when the error not Mongo duplicate error', () => {
    const res = isDuplicateError(Error())

    expect(res).to.be.false
  })
})
