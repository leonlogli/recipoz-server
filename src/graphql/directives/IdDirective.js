/* eslint-disable class-methods-use-this */
import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

class IdDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async function resolveField(...args) {
      const result = await resolve.apply(this, args)
      const id = args[0]._id

      return id || result
    }
  }
}

export { IdDirective }
export default IdDirective
