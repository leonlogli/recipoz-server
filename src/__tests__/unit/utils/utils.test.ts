import { expect } from 'chai'
import {
  isString,
  dotify,
  hasOwnProperties,
  toNestedObject,
  chunk,
  concatValues,
  hasDuplicates,
  hasFalsyValue,
  isEmpty,
  clean,
  renameKeys,
  truncate
} from '../../../utils/Util'

describe('String helper', () => {
  it('should return true when string is passed', () => {
    expect(isString('str')).to.be.equal(true)
  })
  it('should return false for nullable variable', () => {
    expect(isString(null)).to.be.equal(false)
  })
  it('should properly truncate the passed string', () => {
    expect(truncate('Hello world', 8)).to.equal('Hello...')
  })

  it('should truncate the passed string with custom ellipsis', () => {
    expect(truncate('Hello world', 8, '***')).to.equal('Hello***')
  })

  it('should not truncate when the max length is not exceed', () => {
    expect(truncate('Hello world', 100)).to.equal('Hello world')
  })
})

describe('Object helper', () => {
  it('should dotify object when it is not null', () => {
    const obj = { title: { en: 'value' } }

    expect(dotify(obj)).to.eql({ 'title.en': 'value' })
  })

  it('should return empty object when object to dotify is null', () => {
    expect(dotify(null as any)).to.eql({})
  })

  it('should convert doted object to nested one', () => {
    const obj = { 'title.en': 'value' }

    expect(toNestedObject(obj)).to.eql({ title: { en: 'value' } })
  })

  it('should return empty object when object to nestify is undefined', () => {
    expect(toNestedObject(undefined as any)).to.eql({})
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

  it('should split array into chunks of at most 3 elements', () => {
    const res = chunk(['arr1', 'arr2', 'arr3', 'arr4', 'arr5'], 2)
    const expected = [['arr1', 'arr2'], ['arr3', 'arr4'], ['arr5']]

    expect(res).to.eql(expected)
  })

  it('should concat values of the given array using the lowest sub-array length', () => {
    expect(concatValues([['a1', 'b1'], ['a2']])).to.eql(['a1 a2'])
  })

  it('should return true when array has duplicate values', () => {
    expect(hasDuplicates(['a1', 'b1', 'a1'])).to.be.true
  })

  it('should return false when array has no duplicate values', () => {
    expect(hasDuplicates(['a1', 'b1'])).to.be.false
  })

  it('should return true when one of the object keys has falsy value', () => {
    expect(hasFalsyValue({ title: 'val', name: null })).to.be.true
  })

  it('should return false when none of the object keys has falsy value', () => {
    expect(hasFalsyValue({ title: 'val', name: 'Leon' })).to.be.false
    expect(hasFalsyValue({})).to.be.false
  })

  describe('isEmpty checker', () => {
    it('should return true when the given value is empty', () => {
      expect(isEmpty({})).to.be.true
      expect(isEmpty([])).to.be.true
    })

    it('should return false when the given value is not empty', () => {
      expect(isEmpty([0, 1])).to.be.false
      expect(isEmpty({ title: 'val' })).to.be.false
    })
  })

  describe('object cleaner', () => {
    it('should remove undefined attributes in the passed object', () => {
      const obj = { title: 'val', name: undefined, msg: null }

      expect(clean(obj)).to.eql({ title: 'val', msg: null })
    })

    it('should remove undefined and null attributes in the passed object', () => {
      const obj = { msg: 'Hello', test: null, bah: undefined, qty: 0 }

      expect(clean(obj, true)).to.eql({ msg: 'Hello', qty: 0 })
    })

    it('should remove undefined keys in the passed object', () => {
      const obj = { message: 'val', name: 'Leon' }
      const expected = { msg: 'val', name: 'Leon' }

      expect(renameKeys(obj, { message: 'msg' })).to.eql(expected)
    })
  })
})
