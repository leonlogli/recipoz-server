import { expect } from 'chai'
import {
  fromGlobalId,
  toGlobalId,
  toLocalId,
  toLocalIds
} from '../../../utils/globalIdHelper'

describe('Global ID conversion', () => {
  it('converts to global ID', () => {
    expect(toGlobalId('Recipe', '1')).to.equal('UmVjaXBlOjE=')
  })

  it('converts from global ID', () => {
    expect(fromGlobalId('VXNlcjoy')).to.eql({ type: 'User', id: '2' })
  })

  it('converts a global ID to local ID when the right type is provided', () => {
    expect(toLocalId('VXNlcjoy', 'User')).to.eql({ type: 'User', id: '2' })
  })

  it('should not converts to local ID when the wrong type is provided', () => {
    expect(toLocalId('VXNlcjoy', 'Post')).to.eql({ type: null, id: null })
  })

  it('converts multiple global IDs to local IDs of the specified type', () => {
    expect(toLocalIds(['VXNlcjoy', 'FakeGUID'], 'User')).to.eql(['2', null])
  })
})
