/* eslint-disable class-methods-use-this */
import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

import { toLocale } from '../../utils'

class I18nDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function resolveField(...args) {
      const i18nValue = await resolve.apply(this, args)

      return toLocale(i18nValue)
    }
  }
}

export { I18nDirective }
export default I18nDirective
