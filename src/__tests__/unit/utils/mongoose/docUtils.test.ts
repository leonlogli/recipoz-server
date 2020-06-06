import { expect } from 'chai'

import {
  isDuplicateError,
  isValidObjectId,
  objectIdFromDate,
  removeStopwords,
  toObjectId,
  objectIdToDate,
  toSafeObjectId
} from '../../../../utils/mongoose/docUtils'

describe('Mongoose docs helper', () => {
  it('should convert value to ObjectId', () => {
    const id = toObjectId(1)

    expect(String(id)).to.have.lengthOf(24)
  })

  it('should safely convert value to ObjectId', () => {
    const id = toSafeObjectId('5edbf2c568041456e417caeb')

    expect(String(id)).to.equal('5edbf2c568041456e417caeb')
  })

  it('should safely return null when converting undefined value to ObjectId', () => {
    const id = toSafeObjectId(undefined)

    expect(id).to.equal(null)
  })

  it('should safely return null when converting null value to ObjectId', () => {
    const id = toSafeObjectId(null)

    expect(id).to.equal(null)
  })

  it('should safely return null when converting invalid id value to ObjectId', () => {
    const id = toSafeObjectId('2')

    expect(id).to.equal(null)
  })

  it('should convert datetime to ObjectId', () => {
    const id = objectIdFromDate('2020-05-06T05:19:41.000Z')

    expect(String(id)).to.equal('5eb248ed0000000000000000')
  })

  it('should convert ObjectId to date', () => {
    const date = objectIdToDate('5eb248ed0000000000000000')

    expect(date).to.eql(new Date('2020-05-06T05:19:41.000Z'))
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
