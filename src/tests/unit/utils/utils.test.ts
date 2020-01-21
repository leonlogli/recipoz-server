import { expect } from 'chai'
import {
  isString,
  dotify,
  toLocale,
  i18n,
  hasOwnProperty
} from '../../../utils'

describe('utils', () => {
  describe('isString test', () => {
    it('should test if string', () => {
      expect(isString('str')).to.be.equal(true)
    })

    it('should test string instance', () => {
      // eslint-disable-next-line no-new-wrappers
      expect(isString(new String('str'))).to.be.equal(true)
    })
  })

  describe('hasOwnProperty test', () => {
    it('should test if object hasOwnProperty', () => {
      expect(hasOwnProperty({ name: 'ahmed' }, 'name')).to.be.equal(true)
    })

    it('should test empty', () => {
      expect(hasOwnProperty({}, 'title')).to.be.equal(false)
    })
  })

  describe('isString test', () => {
    it('should dotify object', () => {
      const obj = { name: { en: 'value' } }

      expect(dotify(obj)).to.eql({ 'name.en': 'value' })
    })
  })

  describe('toLocale test', () => {
    it('should localize object using default "en" locale"', () => {
      const name = { en: 'value', fr: 'valeur' }

      expect(toLocale(name)).to.equal('value')
    })

    it('should return non localized object', () => {
      expect(toLocale('name')).to.equal('name')
    })

    it('should return undefined for non supported locales', () => {
      const hello = { ar: 'مرحبا', de: 'Hallo' }

      expect(toLocale(hello)).to.equal(undefined)
    })
  })

  describe('i18n', () => {
    it('should have default locale', () => {
      expect(i18n.currentLanguage).to.equal('en')
    })

    it('should return empty string', () => {
      expect(i18n.t('test')).to.equal('')
    })
  })
})
