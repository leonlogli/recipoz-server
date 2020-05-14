import { DataLoaders, i18n, locales } from '../../../utils'
import { loadTagActor } from '../actors'
import { NotificationInput } from '../notificationServiceHelper'

const { notificationMessages } = locales
const { youAreTagged } = notificationMessages
const { t } = i18n

const tagNotificationInfo = async (
  input: NotificationInput,
  loaders: DataLoaders
) => {
  const actor = await loadTagActor(input, loaders)

  const user = actor.name
  const text = t(youAreTagged, { user })

  return { text, actor }
}

export { tagNotificationInfo }
export default tagNotificationInfo
