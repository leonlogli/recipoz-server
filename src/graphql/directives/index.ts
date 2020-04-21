import AuthDirective from './AuthDirective'
import GlobalIdDirective from './GlobalIdDirective'
import I18nDirective from './I18nDirective'

export const schemaDirectives = {
  auth: AuthDirective,
  i18n: I18nDirective,
  guid: GlobalIdDirective
}
export default schemaDirectives
