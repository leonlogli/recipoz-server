import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { calcium, addNutrient, addNutrients } from './data'
import {
  GET_NUTRIENT,
  GET_NUTRIENTS,
  GET_NUTRIENT_BY_ID,
  SEARCH_NUTRIENTS
} from './graph'

describe('Nutrient graph ', () => {
  it('should get Nutrient by id', async () => {
    const id = await addNutrient(calcium)
    const res: any = await _.query(GET_NUTRIENT_BY_ID, {
      variables: { id }
    })

    expect(res.data.nutrientById).to.deep.include({ name: 'Calcium' })
  })

  it('should get Nutrient by name', async () => {
    await addNutrients()
    const res: any = await _.query(GET_NUTRIENT, {
      variables: { criteria: { name: { en: 'Carbs' } } }
    })

    expect(res.data.nutrient).to.deep.include({ name: 'Carbs' })
  })

  it('should get all Nutrients', async () => {
    await addNutrients()
    const res: any = await _.query(GET_NUTRIENTS)
    const { content } = res.data.nutrients
    const containsAll = ['Calcium', 'Carbs', 'Cholesterol', 'Fat'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(4)
    expect(containsAll).to.eq(true)
  })

  it('should search Nutrients by full text', async () => {
    await addNutrients()
    const res: any = await _.query(SEARCH_NUTRIENTS, {
      variables: { criteria: { searchText: 'chole ca' } }
    })
    const { content } = res.data.searchNutrients
    const containsAll = ['Cholesterol', 'Calcium'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(2)
    expect(containsAll).to.eq(true)
  })
})
