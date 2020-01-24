import { expect } from 'chai'

import { ADD_UTENSIL, DELETE_UTENSIL, UPDATE_UTENSIL } from './graph'
import { apolloClient as _ } from '../_.test'
import { knife as utensil, addUtensil } from './data'

describe('Utensil graph ', () => {
  it('should save Utensil', async () => {
    const res: any = await _.mutate(ADD_UTENSIL, { variables: { utensil } })

    expect(res.data.addUtensil).to.deep.include({ name: 'Knife' })
  })

  it('should update Utensil', async () => {
    const id = await addUtensil(utensil)

    const res: any = await _.mutate(UPDATE_UTENSIL, {
      variables: { id, utensil: { name: { en: 'Bowl' } } }
    })

    expect(res.data.updateUtensil).to.deep.include({ name: 'Bowl' })
  })

  it('should delete Utensil', async () => {
    const idOfUtensilToDelete = await addUtensil(utensil)

    const res: any = await _.mutate(DELETE_UTENSIL, {
      variables: { id: idOfUtensilToDelete }
    })

    expect(res.data.deleteUtensil.id).to.equal(idOfUtensilToDelete)
  })
})
