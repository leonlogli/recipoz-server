import { expect } from 'chai'
import {
  isString,
  dotify,
  toLocale,
  transformDoc,
  transformDocs,
  transformSortDirectives,
  i18n
} from '../../../utils'

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

  describe('transform i18n doc', () => {
    it('should transform i18n lean doc', () => {
      const doc = { _id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 }
      const result = transformDoc(doc, true, 'name')

      expect(result).to.eql({ id: 1, name: 'value', age: 19 })
    })

    it('should transform i18n non-lean doc', () => {
      const doc = { id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 }
      const result = transformDoc(doc, false, 'name')

      expect(result).to.eql({ id: 1, name: 'value', age: 19 })
    })

    it('should transform array of i18n lean doc', () => {
      const docs = [
        { _id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 },
        { _id: 2, name: { en: 'value 2', fr: 'valeur 2' }, age: 31 }
      ]
      const result = transformDocs(docs, true, 'name')

      expect(result).to.eql([
        { id: 1, name: 'value', age: 19 },
        { id: 2, name: 'value 2', age: 31 }
      ])
    })

    it('should transform array of i18n non-lean doc', () => {
      const docs = [
        { id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 },
        { id: 2, name: { en: 'value 2', fr: 'valeur 2' }, age: 31 }
      ]
      const result = transformDocs(docs, false, 'name')

      expect(result).to.eql([
        { id: 1, name: 'value', age: 19 },
        { id: 2, name: 'value 2', age: 31 }
      ])
    })
  })

  describe('transform sort directives', () => {
    it('should transform sort directives using supported locales', () => {
      const result = transformSortDirectives('name title', 'title')

      expect(result).to.equal('name title.en title.fr')
    })

    it('should skip sort directives transformation because no i18nField is provided', () => {
      const result = transformSortDirectives('name title')

      expect(result).to.equal('name title')
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
})
