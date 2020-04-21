import DataLoader from 'dataloader'

import { userService } from '../../services'

const userLoader = () => new DataLoader(userService.getUsers)

export { userLoader }
export default userLoader
