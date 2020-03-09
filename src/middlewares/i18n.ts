import { NextFunction, Request, Response } from 'express'
import { APP_DEFAULT_LANGUAGE } from '../config'
import { i18n, isSupportedLanguage, SupportedLanguage } from '../utils'

/**
 * Set the suitable language for i18n. Must be chained after i18nextMiddleware.
 * First try to get the language in 'locales' key provided in the header. If not found or not supported,
 * try to check if i18nextMiddleware detected language is supported. If not,
 * try to find the supported language in 'accept-language'. Otherwise set the default language
 */
const localeDectector = (req: Request, res: Response, next: NextFunction) => {
  const { locale } = req.headers as any
  let language

  if (locale && !!locale.trim()) {
    language = locale.split(',').find((l: string) => isSupportedLanguage(l))
  }

  if (!language || !language.trim()) {
    // the language detected by i18nextMiddleware
    const i18nextLanguage: any = req.language.slice(0, 2)

    if (isSupportedLanguage(i18nextLanguage)) {
      language = i18nextLanguage
    } else {
      // Find suitable language from header Accept-Language that is in the form ("fr-CH, fr;q=0.9, en;q=0.8, *;q=0.5")
      language = req.headers['accept-language']
        ?.split(',')
        .map(lang => lang.split(';')[0].slice(0, 2))
        .find(lang => isSupportedLanguage(lang))
    }
  }

  i18n.currentLanguage = (language || APP_DEFAULT_LANGUAGE) as SupportedLanguage
  i18n.t = req.t
  next()
}

export const i18nMiddleware = { localeDectector }
export default i18nMiddleware
