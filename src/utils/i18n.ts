import { isString } from 'util'
import { APP_DEFAULT_LANGUAGE } from '../config'

export const supportedLanguages = ['en', 'fr'] as const

export type SupportedLanguage = typeof supportedLanguages[number]

export type I18N = {
  /**
   * The current language
   */
  currentLanguage: SupportedLanguage
  /**
   * Retrurns the translated value of the specified key
   */
  t: (key: string, options?: any) => string
}

const isSupportedLanguage = (language: string) => {
  return supportedLanguages.some(lang => language === lang)
}

const i18n: I18N = {
  currentLanguage: APP_DEFAULT_LANGUAGE as any,
  t: () => ''
}

/**
 * Formats i18n record by using the current locale.
 * Ex: toLocale({ en: 'data', fr: 'données' }) == 'data' in case the current locale is 'en'
 * @param record i18n object to format
 */
const toLocale = (record: any) => {
  if (!record || isString(record)) {
    return record
  }

  return (
    record[i18n.currentLanguage as SupportedLanguage] ||
    record[i18n.currentLanguage.slice(0, 2) as SupportedLanguage]
  )
}

export { i18n, toLocale, isSupportedLanguage }
