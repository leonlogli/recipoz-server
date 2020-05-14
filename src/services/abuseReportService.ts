import {
  AbuseReport,
  AbuseReportDocument,
  AbuseReportDataType as DataType
} from '../models'
import {
  i18n,
  getDataLoaderByModel,
  errorRes,
  DataLoaders,
  locales
} from '../utils'
import { ModelService } from './base'
import { logger } from '../config'

const { statusMessages, errorMessages } = locales
const { notFound } = errorMessages.abuseReport
const { cannotReportAbuseOnYourData: cannotReport } = errorMessages.account
const { created, deleted, updated } = statusMessages.abuseReport
const { t } = i18n

const abuseReportModel = new ModelService<AbuseReportDocument>({
  model: AbuseReport,
  onNotFound: notFound
})

const countAbuseReports = abuseReportModel.countByBatch
const getAbuseReports = abuseReportModel.findByIds
const getAbuseReportsByBatch = abuseReportModel.batchFind

type ReportInput = Omit<AbuseReportDocument, 'author' | 'data'> & {
  author: string
  data: string
}

/** Check if an account is the author of the data to report */
const isDataAuthor = async (input: ReportInput, loaders: DataLoaders) => {
  const { data, dataType, author } = input
  const loader = getDataLoaderByModel(dataType, loaders)

  const dataToReport: any = await loader?.load(data)
  const isAuthor = author === dataToReport.author

  return (dataType === 'Account' && author === data) || isAuthor
}

const reportAbuse = async (input: ReportInput, loaders: DataLoaders) => {
  try {
    const { data, dataType, type, author } = input

    if (await isDataAuthor(input, loaders)) {
      return { success: false, message: t(cannotReport), code: 422 }
    }
    const query = { dataType, data, author }
    const set = { $set: { author, data, dataType, type } }

    const abuseReport = await abuseReportModel.createOrUpdate(query, set)

    return { success: true, message: t(created), code: 201, abuseReport }
  } catch (error) {
    return errorRes(error)
  }
}

const suitableErrorResponse = async (abuseReportId: any) => {
  const exists = await abuseReportModel.exists(abuseReportId)
  const message = t(exists ? errorMessages.forbidden : notFound)

  return { success: false, message, code: exists ? 403 : 404 }
}

const updateAbuseReport = async (input: ReportInput, isAdmin = false) => {
  try {
    const { id: _id, status, type, author } = input
    const query = { _id, ...(!isAdmin && { author }) }
    const set = { $set: { type, ...(isAdmin && { status }) } }

    const abuseReport = await abuseReportModel.updateOne(query, set)
    const res = { success: true, message: t(updated), code: 200, abuseReport }

    return abuseReport ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const changeDataAbuseReportsStatus = async (input: ReportInput) => {
  try {
    const { dataType, data, status } = input
    const query: any = { dataType, data }
    const res = await AbuseReport.updateMany(query, { $set: { status } }).exec()

    const mutatedCount = res.mutatedCount || 0
    const success = mutatedCount > 0
    const message = t(success ? updated : notFound)

    return { success, message, code: success ? 200 : 404, mutatedCount }
  } catch (error) {
    return errorRes(error)
  }
}

const deleteAbuseReport = async (input: ReportInput, isAdmin = false) => {
  try {
    const { author, id: _id } = input
    const query = { _id, ...(!isAdmin && { author }) }

    const abuseReport = await abuseReportModel.deleteOne(query)
    const res = { success: true, message: t(deleted), code: 200, abuseReport }

    return abuseReport ? res : suitableErrorResponse(_id)
  } catch (error) {
    return errorRes(error)
  }
}

const deleteAccountAbuseReports = async (accountId: string) => {
  return AbuseReport.deleteMany({
    $or: [{ author: accountId }, { dataType: 'Account', data: accountId }]
  } as any)
    .exec()
    .catch(e => logger.error('Error deleting abuse reports: ', e))
}

const deleteDataAbuseReports = async (dataId: string, dataType: DataType) => {
  return AbuseReport.deleteMany({ dataType, data: dataId } as any)
    .exec()
    .catch(e => logger.error('Error deleting abuse reports: ', e))
}

export const abuseReportService = {
  getAbuseReports,
  countAbuseReports,
  getAbuseReportsByBatch,
  reportAbuse,
  updateAbuseReport,
  deleteAbuseReport,
  deleteAccountAbuseReports,
  deleteDataAbuseReports,
  changeDataAbuseReportsStatus
}
export default abuseReportService
