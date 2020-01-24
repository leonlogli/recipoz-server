import { expect } from 'chai'

import { ADD_NUTRIENT, DELETE_NUTRIENT, UPDATE_NUTRIENT } from './graph'
import { apolloClient as _ } from '../_.test'
import { calcium as nutrient, addNutrient } from './data'

describe('Nutrient graph ', () => {
  it('should save Nutrient', async () => {
    const res: any = await _.mutate(ADD_NUTRIENT, { variables: { nutrient } })

    expect(res.data.addNutrient).to.deep.include({ name: 'Calcium' })
  })

  it('should update Nutrient', async () => {
    const id = await addNutrient(nutrient)

    const res: any = await _.mutate(UPDATE_NUTRIENT, {
      variables: { id, nutrient: { name: { en: 'Calcium' } } }
    })

    expect(res.data.updateNutrient).to.deep.include({ name: 'Calcium' })
  })

  it('should delete Nutrient', async () => {
    const idOfNutrientToDelete = await addNutrient(nutrient)

    const res: any = await _.mutate(DELETE_NUTRIENT, {
      variables: { id: idOfNutrientToDelete }
    })

    expect(res.data.deleteNutrient.id).to.equal(idOfNutrientToDelete)
  })
})
