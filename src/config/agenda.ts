import Agenda from 'agenda'
import { Connection } from 'mongoose'

import logger from './logger'
import { HELLO_WORLD } from '../constants'
import * as Tasks from '../tasks'

const agenda = new Agenda()

Array.from(['SIGTERM', 'SIGINT']).forEach(event => {
  process.on(event as any, async () => {
    await agenda.stop()
    logger.info(`graceful shutdown: ${event}`)
    process.exit(0)
  })
})

// Pass agenda instance to tasks
Tasks.helloWorld(agenda)

/**
 * Starts the job queue processing
 * @param connection mongodb connexion
 */
const startAgenda = async (connection: Connection) => {
  agenda.mongo(connection.db)
  await agenda.start()
  logger.info('Agenda started successfully')

  agenda.every('1000 seconds', HELLO_WORLD)
}

const { schedule: scheduleTask, cancel: cancelTask } = agenda

export { agenda, startAgenda, scheduleTask, cancelTask }
