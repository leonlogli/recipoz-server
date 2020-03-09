import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { foodista, addSource, addSources } from './data'
import {
  GET_SOURCE,
  GET_SOURCES,
  GET_SOURCE_BY_ID,
  SEARCH_SOURCES
} from './graph'

describe('Source graph ', () => {
  it('should get Source by id', async () => {
    const id = await addSource(foodista)
    const res: any = await _.query(GET_SOURCE_BY_ID, {
      variables: { id }
    })

    expect(res.data.sourceById).to.deep.include({ name: 'Foodista' })
  })

  it('should get Source by name', async () => {
    await addSources()
    const res: any = await _.query(GET_SOURCE, {
      variables: { criteria: { name: 'Once Upon a Chef' } }
    })

    expect(res.data.source).to.deep.include({ name: 'Once Upon a Chef' })
  })

  it('should get all Sources', async () => {
    await addSources()
    const res: any = await _.query(GET_SOURCES)
    const { content } = res.data.sources
    const containsAll = [
      'Foodista',
      'Forks Over Knives',
      'Recettesafricaine.com',
      'Once Upon a Chef'
    ].every(i => content.some((c: any) => c.name === i))

    expect(content).to.have.lengthOf(4)
    expect(containsAll).to.eq(true)
  })

  it('should search Sources by full text', async () => {
    await addSources()
    const res: any = await _.query(SEARCH_SOURCES, {
      variables: { criteria: { searchText: 'Foodista Chef' } }
    })
    const { content } = res.data.searchSources
    const containsAll = ['Foodista', 'Once Upon a Chef'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(2)
    expect(containsAll).to.eq(true)
  })
})
