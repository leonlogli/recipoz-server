import { abuseReportService } from '../../services'
import { Context } from '../context'
import { validateAbuseReport, validateCursorQuery } from '../../validations'
import { abuseReportDataTypes } from '../../models'
import {
  buildFilterQuery,
  toLocalId,
  withClientMutationId,
  getDataLoaderByModel,
  isValidObjectId,
  emptyConnection
} from '../../utils'

export default {
  Query: {
    myAbuseReports: (_: any, args: any, ctx: Context) => {
      const cursorQuery = validateCursorQuery(args)
      const { dataLoaders: loaders, accountId: author } = ctx
      const criteria = { dataType: { $in: abuseReportDataTypes }, author }

      return loaders.abuseReportByQueryLoader.load({ ...cursorQuery, criteria })
    },
    abuseReports: (_: any, { data, filter, ...options }: any, ctx: Context) => {
      const dataType = { $in: abuseReportDataTypes }
      let dataLocalId

      if (data) {
        const { type, id } = toLocalId(data, ...abuseReportDataTypes)

        if (!type || !isValidObjectId(id)) {
          return emptyConnection()
        }
        dataType.$in = [type] as any
        dataLocalId = id
      }
      const filterQuery = buildFilterQuery(filter)
      const criteria = { dataType, data: dataLocalId, ...filterQuery }
      const cursorQuery = validateCursorQuery(options)
      const { abuseReportByQueryLoader } = ctx.dataLoaders

      return abuseReportByQueryLoader.load({ ...cursorQuery, criteria })
    }
  },
  Mutation: {
    addAbuseReport: (_: any, { input }: any, ctx: Context) => {
      const { data, ...props } = input
      const { type, id } = toLocalId(data, ...abuseReportDataTypes)
      const { accountId: author, dataLoaders } = ctx

      const value = { ...props, dataType: type, data: id, author }
      const report = validateAbuseReport(value)
      const payload = abuseReportService.reportAbuse(report, dataLoaders)

      return withClientMutationId(payload, input)
    },
    updateAbuseReport: (_: any, { input }: any, ctx: Context) => {
      const { id } = toLocalId(input.id, 'AbuseReport')
      const { accountId: author, isAdmin } = ctx

      const report = validateAbuseReport({ ...input, id, author }, false)
      const payload = abuseReportService.updateAbuseReport(report, isAdmin)

      return withClientMutationId(payload, input)
    },
    deleteAbuseReport: (_: any, { input }: any, ctx: Context) => {
      const { id } = toLocalId(input.id, 'AbuseReport')
      const { accountId: author, isAdmin } = ctx

      const report = validateAbuseReport({ id, author }, false)
      const payload = abuseReportService.deleteAbuseReport(report, isAdmin)

      return withClientMutationId(payload, input)
    },
    changeDataAbuseReportsStatus: (_: any, { input }: any, ctx: Context) => {
      const { data, ...props } = input
      const { type, id } = toLocalId(data, ...abuseReportDataTypes)
      const { accountId: author } = ctx

      const value = { ...props, dataType: type, data: id, author }
      const report = validateAbuseReport(value)
      const payload = abuseReportService.changeDataAbuseReportsStatus(report)

      return withClientMutationId(payload, input)
    }
  },
  AbuseReportOrderBy: {
    DATE_ASC: 'createdAt',
    DATE_DESC: '-createdAt'
  },
  AbuseReportData: {
    __resolveType: (data: any) => data.__typename
  },
  AbuseReport: {
    author: ({ author }: any, _: any, ctx: Context) => {
      return ctx.dataLoaders.accountLoader.load(author)
    },
    data: ({ data, dataType }: any, _: any, { dataLoaders }: Context) => {
      return getDataLoaderByModel(dataType, dataLoaders)?.load(data)
    }
  },
  AbuseReportConnection: {
    totalCount: ({ totalCount, query }: any, _: any, ctx: Context) => {
      const { abuseReportCountLoader } = ctx.dataLoaders

      return totalCount || abuseReportCountLoader.load(query.criteria)
    }
  }
}
