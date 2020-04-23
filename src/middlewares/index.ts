import authMiddleware from './auth'
import i18nMiddleware from './i18n'

export * from './auth'
export * from './i18n'

export default [
  authMiddleware.checkIfAuthenticated,
  i18nMiddleware.localeDectector
]
