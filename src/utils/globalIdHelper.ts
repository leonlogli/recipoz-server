import { toBase64, fromBase64 } from './base64'

export type ResolvedGlobalId = {
  type: string
  id: string
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
const toGlobalId = (type: string, id: string) => {
  return toBase64([type, id].join(':'))
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
const fromGlobalId = (globalId: string) => {
  const unbasedGlobalId = fromBase64(globalId)
  const delimiterPos = unbasedGlobalId.indexOf(':')

  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  } as ResolvedGlobalId
}

/**
 * Converts the global id to local id. This function differs slightly from
 * `fromGlobalId()` in that it returns null if the resolved type is not
 * one of the specified types
 */
const toLocalId = (globalId: string, ...types: string[]) => {
  const res = fromGlobalId(globalId)

  if (types.length > 0 && !types.includes(res.type)) {
    return { type: null, id: null }
  }

  return res
}

/**
 * Converts the given global ids to local ids of the specified type.
 */
const toLocalIds = (globalIds: string[], type: string) => {
  return globalIds.map(guid => toLocalId(guid, type).id)
}

export { toGlobalId, fromGlobalId, toLocalId, toLocalIds }
