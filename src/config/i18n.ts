/* eslint-disable @typescript-eslint/no-var-requires */
import i18next from 'i18next'

import { APP_DEFAULT_LANGUAGE } from './env'
import { supportedLanguages } from '../utils'

const Backend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: `${__dirname}/../resources/locales/{{ns}}/{{lng}}.json`
    },
    fallbackLng: APP_DEFAULT_LANGUAGE,
    preload: Array.from(supportedLanguages || []),
    ns: ['errorMessages', 'statusMessages'],
    defaultNS: 'statusMessages',
    keySeparator: false,
    detection: {
      // order and from where user language should be detected.
      // Ex: ['header', 'querystring', 'cookie']
      order: ['header']
    }
  })

const i18nextHandler = i18nextMiddleware.handle(i18next)

export { i18next, i18nextHandler }
