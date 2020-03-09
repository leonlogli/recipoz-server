import { expect } from 'chai'

import {
  ADD_MEASUREUNIT,
  DELETE_MEASUREUNIT,
  UPDATE_MEASUREUNIT
} from './graph'
import { apolloClient as _ } from '../_.test'
import { cup as measureUnit, addMeasureUnit } from './data'

describe('MeasureUnit graph ', () => {
  it('should save MeasureUnit', async () => {
    const res: any = await _.mutate(ADD_MEASUREUNIT, {
      variables: { measureUnit }
    })

    expect(res.data.addMeasureUnit).to.deep.include({ name: 'cup' })
  })

  it('should update MeasureUnit', async () => {
    const id = await addMeasureUnit(measureUnit)

    const res: any = await _.mutate(UPDATE_MEASUREUNIT, {
      variables: { id, measureUnit: { name: { en: 'fluid ounce' } } }
    })

    expect(res.data.updateMeasureUnit).to.deep.include({ name: 'fluid ounce' })
  })

  it('should delete MeasureUnit', async () => {
    const idOfMeasureUnitToDelete = await addMeasureUnit(measureUnit)

    const res: any = await _.mutate(DELETE_MEASUREUNIT, {
      variables: { id: idOfMeasureUnitToDelete }
    })

    expect(res.data.deleteMeasureUnit.id).to.equal(idOfMeasureUnitToDelete)
  })
})
