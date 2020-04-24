import { expect } from 'chai'
import { errorMessages, statusMessages } from '../../../constants/locales'

describe('constants > locale', () => {
  it('should prepend namespace to i18n keys', () => {
    expect(errorMessages).to.deep.include({
      forbidden: 'errorMessages:forbidden',
      comment: {
        notFound: 'errorMessages:commentNotFound'
      }
    })

    expect(statusMessages).to.deep.include({
      notification: {
        updated: 'statusMessages:notification.updated',
        deleted: 'statusMessages:notification.deleted'
      }
    })
  })
})
