import { expect } from 'chai'
import { statusMessages } from '../../../../constants/locales'

describe('constants > locale', () => {
  it('should prepend namespace to i18n keys', () => {
    expect(statusMessages).to.deep.include({
      notification: {
        updated: 'statusMessages:notification.updated',
        deleted: 'statusMessages:notification.deleted'
      }
    })
  })
})
