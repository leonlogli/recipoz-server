/* eslint-disable class-methods-use-this */
import { SchemaDirectiveVisitor } from 'apollo-server-express'

import { toGlobalId } from '../../utils'

class GlobalIdDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    field.resolve = async function resolveField(...args) {
      return toGlobalId(details.objectType.name, args[0]._id.toString())
    }
  }
}

export { GlobalIdDirective }
export default GlobalIdDirective
