import { expect } from 'chai'
import {
  toLocale,
  i18n,
  appendLangsToFields,
  detectLanguage,
  isSupportedLanguage,
  withNamespace,
  renameI18nKeys
} from '../../../utils/i18n'

describe('i18n helper', () => {
  it('should have default locale as currentLanguage', () => {
    expect(i18n.currentLanguage).to.equal('en')
  })

  it('should return the same key when 18nnext config does not load', () => {
    expect(i18n.t('test')).to.equal('test')
  })

  describe('toLocale converter', () => {
    it('should return the correct value when valid i18n object is passed', () => {
      i18n.currentLanguage = 'fr'
      const title = { en: 'value', fr: 'valeur' }

      expect(toLocale(title)).to.equal('valeur')
    })

    it('returns the first supported language value when the current language key is undefined', () => {
      i18n.currentLanguage = 'en'
      const hello: any = { ar: 'مرحبا', de: 'Hallo', fr: 'Bonjour' }

      expect(toLocale(hello)).to.equal('Bonjour')
    })

    it('should return the same value if the specified value is not an object', () => {
      expect(toLocale('test' as any)).to.equal('test')
    })
  })

  it('should append supported languages', () => {
    expect(appendLangsToFields('title')).to.eql(['title.en', 'title.fr'])
  })

  it('should append supported languages when the passed field string ends already by a supported lang', () => {
    expect(appendLangsToFields('title.fr')).to.eql(['title.en', 'title.fr'])
  })

  it('should append supported languages when the passed field does not end by a supported lang', () => {
    const expected = ['title.de.en', 'title.de.fr']

    expect(appendLangsToFields('title.de')).to.eql(expected)
  })

  it('should append supported languages when multiple fields are specified', () => {
    const arr = ['title.en', 'title.fr', 'description.en', 'description.fr']

    expect(appendLangsToFields('title', 'description')).to.eql(arr)
  })

  it('should detect language when english text is passed', () => {
    expect(detectLanguage('Hello everybody')).to.equal('en')
  })

  it('should detect language when french text is passed', () => {
    expect(detectLanguage('Bonjour tout le monde')).to.equal('fr')
  })

  it('should properly check if a language is supportted', () => {
    expect(isSupportedLanguage('en')).to.be.true
    expect(isSupportedLanguage('ar')).to.be.false
  })

  it('should prepend namespace to all object values', () => {
    const title = { en: 'value', fr: 'valeur' }
    const nsTitle = { en: 'title:value', fr: 'title:valeur' }

    expect(withNamespace(title, 'title')).to.eql(nsTitle)
  })

  it('should rename i18n object keys when tke key to rename is defined', () => {
    const obj = { title: 'value', name: 'Leon' }
    const expected = { 'title.fr': 'value', name: 'Leon' }

    expect(renameI18nKeys(obj, 'fr', 'title')).to.eql(expected)
  })

  it('should not rename object keys when tke key to rename is undefined', () => {
    const obj = { title: 'value', name: 'Leon' }

    expect(renameI18nKeys(obj, 'fr', 'unkownkey')).to.eql(obj)
  })
})
