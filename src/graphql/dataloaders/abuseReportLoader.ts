import DataLoader from 'dataloader'

import { abuseReportService } from '../../services'
import { dataByQueryLoaderOptions as options, prime } from '../../utils'

const {
  getAbuseReportsByBatch,
  getAbuseReports,
  countAbuseReports
} = abuseReportService

const abuseReportLoader = () => new DataLoader(getAbuseReports)

type AbuseReportLoader = ReturnType<typeof abuseReportLoader>

const abuseReportByQueryLoader = (loader: AbuseReportLoader) => {
  return new DataLoader(async queries => {
    const res = await getAbuseReportsByBatch(queries as any)

    for (const page of res) {
      prime(loader, ...page.nodes)
    }

    return res
  }, options)
}

const abuseReportCountLoader = () => {
  return new DataLoader(countAbuseReports, options)
}

export { abuseReportLoader, abuseReportByQueryLoader, abuseReportCountLoader }
