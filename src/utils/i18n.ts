import { isString } from 'util'
import { APP_DEFAULT_LANGUAGE } from '../config'
import { dotify, toNestedObject, renameKeys, hasOwnProperties } from './Util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const franc = require('franc-min')

export const supportedLanguages = ['en', 'fr'] as const

export type I18NRecord<T> = Partial<Record<SupportedLanguage, T>>

export type SupportedLanguage = typeof supportedLanguages[number]

export type I18N = {
  /** The current language */
  currentLanguage: SupportedLanguage
  /** Retrurns the translated value of the specified key */
  t: (key: string, options?: Record<string, any>) => string
}

const isSupportedLanguage = (language?: string) => {
  return supportedLanguages.some(lang => language === lang)
}

const i18n: I18N = {
  currentLanguage: APP_DEFAULT_LANGUAGE,
  t: () => ''
}

/**
 * Formats i18n record by using the current locale.
 * Ex: toLocale({ en: 'data', fr: 'données' }) == 'data' in case the current locale is 'en'
 * @param record i18n object to format
 */
const toLocale = (record: Record<SupportedLanguage, string>) => {
  if (!record || isString(record)) {
    return record
  }

  return (
    record[i18n.currentLanguage] ||
    record[APP_DEFAULT_LANGUAGE] ||
    record[Object.keys(record)[0] as SupportedLanguage]
  )
}

/**
 * Prepends the specified namespace on each property value of the given object.
 * Ex: withNamespace({ key: 'val' }, 'common') == { key: 'common:val' }
 * @param obj i18n locale object
 * @param namespace the namespace
 */
function withNamespace<T>(obj: T, namespace: string): T {
  const dotedObj = dotify(obj)

  Object.keys(dotedObj).forEach(key => {
    dotedObj[key] = `${namespace}:${dotedObj[key]}`
  })

  return toNestedObject(dotedObj)
}

/**
 * Append each supported language to each field in the specified i18nFields.
 * @param i18nFields i18n fields
 */
const appendLangsToFields = (...i18nFields: string[]) => {
  return i18nFields
    .map(i18nField => {
      const paths = i18nField.split('.')
      const field = isSupportedLanguage(paths.pop())
        ? paths.join('.')
        : i18nField

      return supportedLanguages
        .map(lang => {
          return lang === field.split('.').pop() ? field : `${field}.${lang}`
        })
        .join(';')
    })
    .join(';')
    .split(';')
}

const languageConverter: Record<string, SupportedLanguage> = {
  eng: 'en',
  fra: 'fr'
}

/**
 * Detect the language of the specified text
 * @param text text
 */
const detectLanguage = (text: string) => {
  return languageConverter[franc(text)]
}

/**
 * Rename i18n keys in the specified object.
 * Ex:
 *    const obj = { title: 'val', name: 'John' }
 *    renameI18nKeys(obj, 'en', 'title') = { title.en: 'val', name: 'John' }
 * @param obj i18n data input
 * @param i18nFields i18n fieds in obj
 */
const renameI18nKeys = (
  obj: Record<string, any>,
  language: SupportedLanguage,
  ...i18nFields: string[]
) => {
  if (!language) {
    return obj
  }
  const keysMap = i18nFields.map(key => {
    if (hasOwnProperties(obj, key)) {
      return { [key]: `${key}.${language}` }
    }

    return { [key]: key }
  })

  return renameKeys(obj, ...keysMap)
}

export {
  i18n,
  toLocale,
  isSupportedLanguage,
  withNamespace,
  detectLanguage,
  appendLangsToFields,
  renameI18nKeys
}
