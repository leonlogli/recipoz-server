import DataLoader from 'dataloader'

import { Tracking } from '../../models'
import { ApiError } from '../../utils'

const trackingLoader = () => {
  return new DataLoader(async (ids: any) => {
    const trackings = await Tracking.find({ _id: { $in: ids } })
      .lean()
      .exec() // may return data in a different order than ids'

    // The results must be returned in the same order of the keys (ids) passed to this function
    return ids.map(
      (id: any) =>
        trackings.find(tracking => tracking._id.toString() === id) ||
        new ApiError('Tracking not found', '404')
    )
  })
}

export { trackingLoader }
export default trackingLoader
