import Joi from '@hapi/joi'

import { checkAndSendValidationErrors } from '../utils'
import { abuseTypes, abuseReportDataTypes, abuseReportStatus } from '../models'
import { objectId, id, required } from './common.validation'

const abuseReportSchema = Joi.object({
  id,
  type: Joi.string()
    .valid(...abuseTypes)
    .when('$isNew', { is: true, then: required }),
  data: objectId.when('$isNew', { is: true, then: required }),
  author: objectId.required(),
  dataType: Joi.string()
    .valid(...abuseReportDataTypes)
    .when('$isNew', { is: true, then: required }),
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
