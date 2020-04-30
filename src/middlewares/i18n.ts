import { NextFunction, Request, Response } from 'express'
import { APP_DEFAULT_LANGUAGE } from '../config'
import { isSupportedLanguage, i18n } from '../utils'

/**
 * Find suitable language from header Accept-Language that is in the form ("fr-CH, fr;q=0.9, en;q=0.8, *;q=0.5")
 */
const getSuitableLangFromHeader = (req: Request) => {
  return req.headers['accept-language']
    ?.split(',')
    .map(lang => lang.split(';')[0].slice(0, 2))
    .find(lang => isSupportedLanguage(lang))
}

/**
 * Set the suitable language for i18n. Must be chained after i18nextMiddleware.
 * First try to get the language in 'locale' key provided in the header. If not found or not supported,
 * try to check if i18nextMiddleware detected language is supported. If not,
 * try to find the supported language in 'accept-language'. Otherwise set the default language
 */
const localeDectector = (req: any, _res: Response, next: NextFunction) => {
  try {
    const { locale } = req.headers
    let language = locale?.split(',').find((l: any) => isSupportedLanguage(l))

    if (!isSupportedLanguage(language)) {
      // Get the language detected by i18nextMiddleware
      const i18nextLanguage: any = req.language.slice(0, 2)
      const isSupported = isSupportedLanguage(i18nextLanguage)

      language = isSupported ? i18nextLanguage : getSuitableLangFromHeader(req)
    }

    req.currentLanguage = language || APP_DEFAULT_LANGUAGE
    i18n.t = req.t
    i18n.currentLanguage = req.currentLanguage
  } catch (error) {
    req.error = error
  }

  next()
}

export const i18nMiddleware = { localeDectector }
export default i18nMiddleware
