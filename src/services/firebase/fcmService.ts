import { firebaseAdmin } from '../../config/firebase'
import { logger } from '../../config'
import { chunk } from '../../utils'
import accountService from '../accountService'
import { Account } from '../../models'

export type Message = firebaseAdmin.messaging.Message
export type MulticastMessage = firebaseAdmin.messaging.MulticastMessage

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
  return firebaseAdmin
    .messaging()
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
  return firebaseAdmin
    .messaging()
    .subscribeToTopic(registrationToken, topic)
    .then(response => response.successCount === 1)
    .catch(error => {
      logger.error('Error subscribing to topic: ', error)

      return false
    })
}

/**
 * Sends the given message to all devices of the specified users.
 * @param accounts account ids
 * @param message message to send
 */
const sendMessageToUsers = async (
  message: Omit<MulticastMessage, 'tokens'>,
  ...accounts: string[]
) => {
  if (accounts.length === 0) {
    return
  }
  const accountDocs = await accountService.getAccountsAndSelect(
    { _id: { $in: accounts } },
    'registrationTokens'
  )
  const registrationTokens: string[] = []

  accountDocs.forEach(account => {
    registrationTokens.push(...account.registrationTokens)
  })

  if (registrationTokens.length === 0) {
    return
  }
  const values = chunk(registrationTokens, 500).map(tokens =>
    sendMessageToDevices({ ...message, tokens })
  )

  return Promise.all(values)
}

const sendMessages = async (...messages: Message[]) => {
  if (messages.length === 0) {
    return
  }
  const values = chunk(messages, 500).map(chunkedMessages =>
    firebaseAdmin
      .messaging()
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

  Promise.all(values)
}

const isValidFCMToken = async (registrationToken: string) => {
  return firebaseAdmin
    .messaging()
    .send({ token: registrationToken }, true)
    .then(() => true)
    .catch(() => false)
}

export const fcmService = {
  subscribeToTopic,
  sendMessageToDevices,
  sendMessages,
  sendMessageToUsers,
  isValidFCMToken
}
export default fcmService
