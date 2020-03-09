import { expect } from 'chai'

import { buildSort } from '../../../utils'

describe('sort helpers', () => {
  it('should build sort directives using supported locales', () => {
    const result = buildSort('name -age title', ['title'])

    expect(result).to.equal('name -age title.en title.fr')
  })

  it('should skip sort directives build because no i18nField is specified', () => {
    const result = buildSort('name title')

    expect(result).to.equal('name title')
  })
})
