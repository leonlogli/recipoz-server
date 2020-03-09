import DataLoader from 'dataloader'

import { userService } from '../../services'
import { UserDocument } from '../../models'

// This is not a batching loader because firebase database does not support batching
// So this loader is defined for caching purpose only
const userLoader = () => {
  return new DataLoader<string, UserDocument>(async (ids: any) => {
    return ids.map((id: any) => userService.getUser({ id }))
  })
}

export { userLoader }
export default userLoader
