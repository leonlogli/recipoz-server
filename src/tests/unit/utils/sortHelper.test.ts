import { expect } from 'chai'

import { sortDirectivesToObject, buildSortDirectives } from '../../../utils'

describe('sort helpers', () => {
  it('should build sort directives using supported locales', () => {
    const result = buildSortDirectives('name -age title', ['title'])

    expect(result).to.equal('name -age title.en title.fr')
  })

  it('should skip sort directives build because no i18nField is specified', () => {
    const result = buildSortDirectives('name title')

    expect(result).to.equal('name title')
  })

  it('should convert sort directives build', () => {
    const result = sortDirectivesToObject('title -name')

    expect(result).to.eql({ title: 1, name: -1 })
  })
  it('should returns empty object if no sort directives is specified', () => {
    const result = sortDirectivesToObject()

    expect(result).to.eql({})
  })
})
