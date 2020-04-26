import { expect } from 'chai'

import * as roles from '../../../constants/roles'

describe('constants', () => {
  it('should return user roles', () => {
    const expected = {
      ADMIN: 'ADMIN',
      USER: 'USER'
    }

    expect(roles).to.eql(expected)
  })
})
