import { expect } from 'chai'
import { fromBase64, toBase64 } from '../../../utils/base64'

const exampleUtf8 = 'Some examples: ❤😀'
const exampleBase64 = 'U29tZSBleGFtcGxlczog4p2k8J+YgA=='

describe('utils > base64 conversion', () => {
  it('converts from utf-8 to base64', () => {
    expect(toBase64(exampleUtf8)).to.equal(exampleBase64)
  })

  it('converts from base64 to utf-8', () => {
    expect(fromBase64(exampleBase64)).to.equal(exampleUtf8)
  })
})
