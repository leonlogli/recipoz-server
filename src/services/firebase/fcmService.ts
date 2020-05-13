import { logger } from '../../config'
import { chunk } from '../../utils'
import { Account, AccountDocument } from '../../models'
import {
  MulticastMessage,
  Notification,
  buildCrossPlatformMessage,
  Message,
  messaging
} from './fcmServiceBase'

const removeFailedRegistrationTokens = async (...failedTokens: string[]) => {
  if (failedTokens.length === 0) {
    return
  }
  await Account.updateMany(
    { registrationTokens: { $in: failedTokens } },
    { $pull: { registrationTokens: { $in: failedTokens } } }
  ).exec()
  logger.debug(`Failed tokens: ${failedTokens} successfully removed`)
}

const sendMessageToDevices = async (message: MulticastMessage) => {
  return messaging
    .sendMulticast(message)
    .then(async response => {
      if (response.failureCount > 0) {
        const failedTokens: string[] = []

        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            failedTokens.push(message.tokens[index])
          }
        })
        removeFailedRegistrationTokens(...failedTokens)
      }
    })
    .catch(error => logger.error('Error sending message: ', error))
}

const subscribeToTopic = async (registrationToken: string, topic: string) => {
  return messaging
    .subscribeToTopic(registrationToken, topic)
    .then(response => response.successCount === 1)
    .catch(error => {
      logger.error('Error subscribing to topic: ', error)

      return false
    })
}

/**
 * Sends the given message to all devices of the specified users.
 * @param accounts account
 * @param message message to send
 */
const sendMessageToUsers = async (
  message: Notification,
  ...accounts: AccountDocument[]
) => {
  if (accounts.length === 0) {
    return
  }
  const registrationTokens: string[] = []
  const msg = buildCrossPlatformMessage(message)

  accounts.forEach(account => {
    registrationTokens.push(...account.registrationTokens)
  })

  if (registrationTokens.length === 0) {
    return
  }
  const promises = chunk(registrationTokens, 500).map(tokens =>
    sendMessageToDevices({ ...msg, tokens })
  )

  return Promise.all(promises)
}

const sendMessages = async (...messages: Notification[]) => {
  const msg = messages.map(m => buildCrossPlatformMessage(m) as Message)

  if (msg.length === 0) {
    return
  }
  const promises = chunk(msg, 500).map(chunkedMessages =>
    messaging
      .sendAll(chunkedMessages)
      .then(response => {
        if (response.failureCount > 0) {
          const failedMsg: Message[] = []

          response.responses.forEach((resp, index) => {
            if (!resp.success) {
              failedMsg.push(chunkedMessages[index])
            }
          })
          removeFailedRegistrationTokens(
            ...failedMsg.map((m: any) => m.token).filter(i => i != null)
          )
        }
      })
      .catch(error => logger.error('Error sending message: ', error))
  )

  return Promise.all(promises)
}

export const fcmService = {
  subscribeToTopic,
  sendMessages,
  sendMessageToUsers
}
export default fcmService
