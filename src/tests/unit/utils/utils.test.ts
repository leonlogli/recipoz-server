import { expect } from 'chai'
import {
  isString,
  dotify,
  hasOwnProperties,
  toNestedObject
} from '../../../utils/Util'

describe('String', () => {
  it('should return true when string is passed', () => {
    expect(isString('str')).to.be.equal(true)
  })
  it('should return false for nullable variable', () => {
    expect(isString(null)).to.be.equal(false)
  })
})

describe('Object', () => {
  it('should dotify object', () => {
    const obj = { title: { en: 'value' } }

    expect(dotify(obj)).to.eql({ 'title.en': 'value' })
    expect(dotify(null)).to.eql({})
  })

  it('should convert doted object to nested one', () => {
    const obj = { 'title.en': 'value' }

    expect(toNestedObject(obj)).to.eql({ title: { en: 'value' } })
    expect(toNestedObject(undefined)).to.eql({})
  })

  it('should return true when the object has property', () => {
    expect(hasOwnProperties({ name: 'Leon' }, 'name')).to.be.equal(true)
  })

  it('should return false when one of the properties does not exist', () => {
    const obj = { name: 'Leon', title: 'GraphQl' }

    expect(hasOwnProperties(obj, 'name', 'text')).to.be.equal(false)
  })

  it('should return false for empty obj', () => {
    expect(hasOwnProperties({}, 'title')).to.be.equal(false)
  })
})
