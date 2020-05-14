import { DataLoaders, i18n, locales } from '../../../utils'
import { loadTagActor } from '../actors'
import { NotificationInput } from '../notificationServiceHelper'

const { notificationMessages } = locales
const { youAreTagged } = notificationMessages

const tagNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const actor = await loadTagActor(input, loaders)

  const user = actor.name
  const text = i18n.t(youAreTagged, { user })

  // Acotors field here is just for type compatibility
  return { text, actor, actors: [actor] }
}

export { tagNotificationInfo }
export default tagNotificationInfo
