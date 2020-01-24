import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { butter, addIngredients, addIngredient } from './data'
import {
  GET_INGREDIENT,
  GET_INGREDIENTS,
  GET_INGREDIENT_BY_ID,
  SEARCH_INGREDIENTS
} from './graph'

describe('ingredient graph ', () => {
  it('should get ingredient by id', async () => {
    const id = await addIngredient(butter)
    const res: any = await _.query(GET_INGREDIENT_BY_ID, {
      variables: { id }
    })

    expect(res.data.ingredientById).to.deep.include({ name: 'Butter' })
  })

  it('should get ingredient by name', async () => {
    await addIngredients()
    const res: any = await _.query(GET_INGREDIENT, {
      variables: { criteria: { name: { en: 'Salt' } } }
    })

    expect(res.data.ingredient).to.deep.include({ name: 'Salt' })
  })

  it('should get all ingredients', async () => {
    await addIngredients()
    const res: any = await _.query(GET_INGREDIENTS)
    const { content } = res.data.ingredients
    const containsAll = ['Butter', 'Salt', 'Onion', 'Olive oil'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(4)
    expect(containsAll).to.eq(true)
  })

  it('should search ingredients by full text', async () => {
    await addIngredients()
    const res: any = await _.query(SEARCH_INGREDIENTS, {
      variables: { criteria: { searchText: 'Salt Oil' } }
    })
    const { content } = res.data.searchIngredients
    const containsAll = ['Salt', 'Olive oil'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(2)
    expect(containsAll).to.eq(true)
  })
})
