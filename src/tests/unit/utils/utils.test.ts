import { expect } from 'chai'
import { isString, dotify } from '../../../utils'

describe('Util package', () => {
  describe('isString test', () => {
    it('should test if string', () => {
      expect(isString('str')).to.be.equal(true)
    })

    it('should test string instance', () => {
      // eslint-disable-next-line no-new-wrappers
      expect(isString(new String('str'))).to.be.equal(true)
    })
  })

  it('should dotify object', () => {
    const obj = { name: { en: 'value' } }

    expect(dotify(obj)).to.eql({ 'name.en': 'value' })
  })
})
