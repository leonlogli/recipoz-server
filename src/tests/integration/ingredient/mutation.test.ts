import { expect } from 'chai'

import { ADD_INGREDIENT, DELETE_INGREDIENT, UPDATE_INGREDIENT } from './graph'
import { apolloClient as _ } from '../_.test'
import { butter as ingredient, addIngredient } from './data'

describe('Ingredient graph ', () => {
  it('should save ingredient', async () => {
    const res: any = await _.mutate(ADD_INGREDIENT, {
      variables: { ingredient }
    })

    expect(res.data.addIngredient).to.deep.include({ name: 'Butter' })
  })

  it('should update ingredient', async () => {
    const id = await addIngredient(ingredient)

    const res: any = await _.mutate(UPDATE_INGREDIENT, {
      variables: { id, ingredient: { name: { en: 'Sugar' } } }
    })

    expect(res.data.updateIngredient).to.deep.include({ name: 'Sugar' })
  })

  it('should delete ingredient', async () => {
    const idOfIngredientToDelete = await addIngredient(ingredient)

    const res: any = await _.mutate(DELETE_INGREDIENT, {
      variables: { id: idOfIngredientToDelete }
    })

    expect(res.data.deleteIngredient.id).to.equal(idOfIngredientToDelete)
  })
})
