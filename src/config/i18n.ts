import i18next from 'i18next'
import i18nextMiddleware from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'
import { APP_DEFAULT_LANGUAGE } from './env'

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: `${__dirname}/../locales/{{ns}}/{{lng}}.json`
    },
    fallbackLng: APP_DEFAULT_LANGUAGE,
    preload: ['en', 'fr'],
    ns: ['errorMessages'],
    defaultNS: 'errorMessages',
    detection: {
      // order and from where user language should be detected
      order: ['header', 'querystring', 'cookie']
    }
  })

const i18nextHandler = i18nextMiddleware.handle(i18next)

export { i18next, i18nextHandler }
