import { expect } from 'chai'

import { ADD_SOURCE, DELETE_SOURCE, UPDATE_SOURCE } from './graph'
import { apolloClient as _ } from '../_.test'
import { foodista as source, addSource } from './data'

describe('Source graph ', () => {
  it('should save Source', async () => {
    const res: any = await _.mutate(ADD_SOURCE, { variables: { source } })

    expect(res.data.addSource).to.deep.include({ name: 'Foodista' })
  })

  it('should update Source', async () => {
    const id = await addSource(source)

    const res: any = await _.mutate(UPDATE_SOURCE, {
      variables: { id, source: { name: 'Allrecipes' } }
    })

    expect(res.data.updateSource).to.deep.include({ name: 'Allrecipes' })
  })

  it('should delete Source', async () => {
    const idOfSourceToDelete = await addSource(source)

    const res: any = await _.mutate(DELETE_SOURCE, {
      variables: { id: idOfSourceToDelete }
    })

    expect(res.data.deleteSource.id).to.equal(idOfSourceToDelete)
  })
})
