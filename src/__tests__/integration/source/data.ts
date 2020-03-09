/* eslint-disable quotes */
import { apolloClient as _ } from '../_.test'
import { ADD_SOURCE } from './graph'

const foodista = {
  name: 'Foodista',
  website: 'Foodista.com'
}

const forksoverknives = {
  name: 'Forks Over Knives',
  website: 'forksoverknives.com'
}

const recettesafricaine = {
  name: 'Recettesafricaine.com',
  website: 'recettesafricaine.com'
}

const onceuponachef = {
  name: 'Once Upon a Chef',
  website: 'onceuponachef.com'
}

// helpers

const addSource = async (source: any) => {
  const m: any = await _.mutate(ADD_SOURCE, { variables: { source } })

  return m.data.addSource.id
}

const addSources = () => {
  return Promise.all(
    [forksoverknives, recettesafricaine, foodista, onceuponachef].map(i =>
      addSource(i)
    )
  )
}

export {
  foodista,
  forksoverknives,
  recettesafricaine,
  onceuponachef,
  addSources,
  addSource
}
