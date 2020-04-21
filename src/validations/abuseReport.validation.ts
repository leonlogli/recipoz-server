import Joi, { required } from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { abuseTypes, abuseReportDataTypes, abuseReportStatus } from '../models'
import { objectIdSchema, idSchema } from './common.validation'

const abuseReportSchema = Joi.object({
  id: idSchema,
  type: Joi.string()
    .valid(...abuseTypes)
    .when('$isNew', { is: true, then: required() }),
  data: objectIdSchema.when('$isNew', { is: true, then: required() }),
  author: objectIdSchema.required(),
  dataType: Joi.string()
    .valid(...abuseReportDataTypes)
    .when('$isNew', { is: true, then: required() }),
  status: Joi.string().valid(...abuseReportStatus)
})

const validateAbuseReport = (data: any, isNew = true) => {
  const { clientMutationId: _, ...abuseReport } = data
  const { error, value } = abuseReportSchema.validate(abuseReport, {
    abortEarly: false,
    context: { isNew }
  })

  checkAndSendValidationErrors(error)

  return value
}

export { validateAbuseReport }
