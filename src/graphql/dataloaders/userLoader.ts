import DataLoader from 'dataloader'

import { userService } from '../../services'

const userLoader = () => {
  return new DataLoader(async (ids: any) => {
    return ids.map((id: any) => userService.getUser({ id }))
  })
}

export { userLoader }
export default userLoader
