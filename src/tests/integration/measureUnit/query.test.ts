import { expect } from 'chai'

import { apolloClient as _ } from '../_.test'
import { cup, addMeasureUnits, addMeasureUnit } from './data'
import {
  GET_MEASUREUNIT,
  GET_MEASUREUNITS,
  GET_MEASUREUNIT_BY_ID,
  SEARCH_MEASUREUNITS
} from './graph'

describe('MeasureUnit graph ', () => {
  it('should get MeasureUnit by id', async () => {
    const id = await addMeasureUnit(cup)
    const res: any = await _.query(GET_MEASUREUNIT_BY_ID, {
      variables: { id }
    })

    expect(res.data.measureUnitById).to.deep.include({ name: 'cup' })
  })

  it('should get MeasureUnit by name', async () => {
    await addMeasureUnits()
    const res: any = await _.query(GET_MEASUREUNIT, {
      variables: { criteria: { name: { en: 'ounce' } } }
    })

    expect(res.data.measureUnit).to.deep.include({ name: 'ounce' })
  })

  it('should get all MeasureUnits', async () => {
    await addMeasureUnits()
    const res: any = await _.query(GET_MEASUREUNITS)
    const { content } = res.data.measureUnits
    const containsAll = ['ounce', 'cup', 'teaspoon', 'tablespoon'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(4)
    expect(containsAll).to.eq(true)
  })

  it('should search MeasureUnits by full text', async () => {
    await addMeasureUnits()
    const res: any = await _.query(SEARCH_MEASUREUNITS, {
      variables: { criteria: { searchText: 'cup' } }
    })
    const { content } = res.data.searchMeasureUnits
    const containsAll = ['teaspoon', 'cup', 'teaspoon'].every(i =>
      content.some((c: any) => c.name === i)
    )

    expect(content).to.have.lengthOf(3)
    expect(containsAll).to.eq(true)
  })
})
