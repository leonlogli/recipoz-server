import DataLoader from 'dataloader'

import { Notification } from '../../models'
import { ApiError } from '../../utils'

const notificationLoader = () => {
  return new DataLoader(async (ids: any) => {
    const notifications = await Notification.find({ _id: { $in: ids } })
      .lean()
      .exec() // may return data in a different order than ids'

    // The results must be returned in the same order of the keys (ids) passed to this function
    return ids.map(
      (id: any) =>
        notifications.find(
          notification => notification._id.toString() === id
        ) || new ApiError('Notification not found', '404')
    )
  })
}

export { notificationLoader }
export default notificationLoader
