/* eslint-disable class-methods-use-this */
import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'

import { ForbiddenError } from '../../utils'

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type)
    type.requiredRole = this.args.requires
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field.requiredRole = this.args.requires
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field

      field.resolve = async function resolveField(...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field
        const requiredRole = field.requiredRole || objectType.requiredRole

        if (!requiredRole) {
          return resolve.apply(this, args)
        }

        const context = args[2]
        const { userRoles, requireAuth } = context

        requireAuth()

        if (!userRoles.includes(requiredRole)) {
          throw new ForbiddenError()
        }

        return resolve.apply(this, args)
      }
    })
  }
}

export { AuthDirective }
export default AuthDirective
