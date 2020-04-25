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

describe('utils > i18n', () => {
  it('should have default locale', () => {
    expect(i18n.currentLanguage).to.equal('en')
  })

  it('should the given key when 18nnext config does not load', () => {
    expect(i18n.t('test')).to.equal('test')
  })

  it('should localize object using default "en" locale"', () => {
    const title = { en: 'value', fr: 'valeur' }

    expect(toLocale(title)).to.equal('value')
  })

  it('should return the first supported language key', () => {
    const hello: any = { ar: 'مرحبا', de: 'Hallo', fr: 'Bonjour' }

    expect(toLocale(hello)).to.equal('Bonjour')
  })

  it('should return the first key for non supported locales', () => {
    const hello: any = { ar: 'مرحبا', de: 'Hallo' }

    expect(toLocale(hello)).to.equal('مرحبا')
  })

  it('should return non supported types', () => {
    expect(toLocale(null as any)).to.equal(null)
    expect(toLocale('test' as any)).to.equal('test')
  })

  it('should append supported languages', () => {
    expect(appendLangsToFields('title')).to.eql(['title.en', 'title.fr'])
    expect(appendLangsToFields('title.fr')).to.eql(['title.en', 'title.fr'])
  })

  it('should append supported languages when the field does not end by a supported lang', () => {
    const res = ['title.unsupportedLang.en', 'title.unsupportedLang.fr']

    expect(appendLangsToFields('title.unsupportedLang')).to.eql(res)
  })

  it('should append supported languages when for multiple fields', () => {
    const arr = ['title.en', 'title.fr', 'description.en', 'description.fr']

    expect(appendLangsToFields('title', 'description')).to.eql(arr)
  })

  it('should detect language in the text', () => {
    expect(detectLanguage('Hello everybody')).to.equal('en')
    expect(detectLanguage('Bonjour tout le monde')).to.equal('fr')
  })

  it('should detect if a language is supportted', () => {
    expect(isSupportedLanguage('en')).to.be.true
    expect(isSupportedLanguage('fr')).to.be.true
    expect(isSupportedLanguage('ar')).to.be.false
    expect(isSupportedLanguage()).to.be.false
  })

  it('should prepend namespace to all object values', () => {
    const title = { en: 'value', fr: 'valeur' }
    const nsTitle = { en: 'title:value', fr: 'title:valeur' }

    expect(withNamespace(title, 'title')).to.eql(nsTitle)
  })

  it('should rename object keys', () => {
    const obj = { title: 'value', name: 'Leon' }
    const res = { 'title.fr': 'value', name: 'Leon' }

    expect(renameI18nKeys(obj, 'fr', 'title')).to.eql(res)
    expect(renameI18nKeys(obj, 'fr', 'unkownkey')).to.eql(obj)
  })
})
