import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { knife, addUtensils, addUtensil } from './data'
import {
  GET_UTENSIL,
  GET_UTENSILS,
  GET_UTENSIL_BY_ID,
  SEARCH_UTENSILS
} from './graph'

describe('Utensil graph ', () => {
  it('should get Utensil by id', async () => {
    const id = await addUtensil(knife)
    const res: any = await _.query(GET_UTENSIL_BY_ID, {
      variables: { id }
    })

    expect(res.data.utensilById).to.deep.include({ name: 'Knife' })
  })

  it('should get Utensil by name', async () => {
    await addUtensils()
    const res: any = await _.query(GET_UTENSIL, {
      variables: { criteria: { name: { en: 'Knife' } } }
    })

    expect(res.data.utensil).to.deep.include({ name: 'Knife' })
  })

  it('should get all Utensils', async () => {
    await addUtensils()
    const res: any = await _.query(GET_UTENSILS)
    const { content } = res.data.utensils
    const containsAll = [
      'Knife',
      'Peeler',
      'Salad Spinner',
      'Stainless Steel Mixing Bowl'
    ].every(i => content.some((c: any) => c.name === i))

    expect(content).to.have.lengthOf(4)
    expect(containsAll).to.eq(true)
  })

  it('should search Utensils by full text', async () => {
    await addUtensils()
    const res: any = await _.query(SEARCH_UTENSILS, {
      variables: { criteria: { searchText: 'tool' } }
    })
    const { content } = res.data.searchUtensils
    const containsAll = ['Knife', 'Salad Spinner'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(2)
    expect(containsAll).to.eq(true)
  })
})
