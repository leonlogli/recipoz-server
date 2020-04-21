import { format, transports, createLogger } from 'winston'

import { PROD_ENV } from './env'

const logger = createLogger({
  level: 'info',
  format: format.combine(format.colorize(), format.json(), format.timestamp()),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({
      filename: '.logs/error.log',
      level: 'error',
      maxsize: 10000000
    }),
    new transports.File({
      filename: '.logs/combined.log',
      maxsize: 5000000
    })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!PROD_ENV) {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  )
}

export default logger
export { logger }
