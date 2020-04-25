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
  removeUndefinedKeys,
  renameKeys
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

  it('should split array into chunks of at most 3 elements', () => {
    const res = chunk(['arr1', 'arr2', 'arr3', 'arr4', 'arr5'], 2)

    expect(res[0]).to.eql(['arr1', 'arr2'])
    expect(res[1]).to.eql(['arr3', 'arr4'])
    expect(res[2]).to.eql(['arr5'])
    expect(res).to.have.lengthOf(3)
  })

  it('should concat values of the given array using the lowest sub-array length', () => {
    expect(concatValues([['a1', 'b1'], ['a2']])).to.eql(['a1 a2'])
  })

  it('should detect when array has duplicate values', () => {
    expect(hasDuplicates(['a1', 'b1'])).to.be.false
    expect(hasDuplicates(['a1', 'b1', 'a1'])).to.be.true
  })

  it('should detect when one of the object keys has falsy value', () => {
    expect(hasFalsyValue({ title: 'val', name: null })).to.be.true
    expect(hasFalsyValue({ title: 'val', name: 'Leon' })).to.be.false
    expect(hasFalsyValue({})).to.be.false
  })

  it('should check if variable is empty', () => {
    expect(isEmpty({ title: 'val' })).to.be.false
    expect(isEmpty({})).to.be.true
    expect(isEmpty([])).to.be.true
  })

  it('should remove undefined keys in the passed object', () => {
    const obj = { title: 'val', name: undefined }

    expect(removeUndefinedKeys(obj)).to.eql({ title: 'val' })
    expect(removeUndefinedKeys({ title: 'val' })).to.eql({ title: 'val' })
  })

  it('should remove undefined keys in the passed object', () => {
    const obj = { message: 'val', name: 'Leon' }
    const res = { msg: 'val', name: 'Leon' }

    expect(renameKeys(obj, { message: 'msg' })).to.eql(res)
  })
})
