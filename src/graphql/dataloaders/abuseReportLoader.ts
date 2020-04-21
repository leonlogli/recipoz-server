import DataLoader from 'dataloader'

import { abuseReportService } from '../../services'
import { dataByQueryLoaderOptions as options } from '../../utils'

const {
  getAbuseReportsByBatch,
  getAbuseReports,
  countAbuseReports
} = abuseReportService

const abuseReportLoader = () => new DataLoader(getAbuseReports)

const abuseReportByQueryLoader = () => {
  return new DataLoader(getAbuseReportsByBatch, options)
}

const abuseReportCountLoader = () => {
  return new DataLoader(countAbuseReports, options)
}

export { abuseReportLoader, abuseReportByQueryLoader, abuseReportCountLoader }
