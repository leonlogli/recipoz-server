import { expect } from 'chai'
import { Filter } from '../../../utils'

describe('filter query', () => {
  const filterBuilder = new Filter({
    i18nFields: ['title', 'country']
  })

  it('should build filter query', async () => {
    const result = await filterBuilder.build([
      'name.in:ahmed,ali',
      'quantity.gte:5',
      'number.mod:2,0',
      'description.exists:true',
      'status.ne:free',
      'content.like:breakfast',
      'location.sw:South',
      'email.ew:com',
      'ingredient.!like:Onion',
      'tel.exists:true',
      'tel.sw:06'
    ])

    expect(result).to.eql({
      name: { $in: ['ahmed', 'ali'] },
      quantity: { $gte: 5 },
      number: { $mod: [2, 0] },
      description: { $exists: true },
      status: { $ne: 'free' },
      content: { $regex: /breakfast/i },
      location: { $regex: /^South/i },
      email: { $regex: /com$/i },
      ingredient: { $not: { $regex: /Onion/i } },
      tel: { $exists: true, $regex: /^06/i }
    })
  })

  it('should build filter query that contains i18n paths', async () => {
    const result = await filterBuilder.build([
      'title.all:NodeJS,Java',
      'country.fr.like:Maroc'
    ])

    expect(result).to.eql({
      'title.en': { $all: ['NodeJS', 'Java'] },
      'country.fr': { $regex: /Maroc/i }
    })
  })

  it('should build filter that contains meta operator', async () => {
    const result = await filterBuilder.build([
      'name.in:ahmed,ali',
      'or:[quantity.gte:5;number.mod:4,2]'
    ])

    expect(result).to.eql({
      name: { $in: ['ahmed', 'ali'] },
      $or: [{ quantity: { $gte: 5 } }, { number: { $mod: [4, 2] } }]
    })
  })

  it('should build filter that contains multiple, meta operators', async () => {
    const result = await filterBuilder.build([
      'name.in:ahmed,ali',
      'or:[quantity.gte:5;number.mod:2,0]',
      'and:[quantity.lt:5;number.mod:3,1]'
    ])

    expect(result).to.eql({
      name: { $in: ['ahmed', 'ali'] },
      $or: [{ quantity: { $gte: 5 } }, { number: { $mod: [2, 0] } }],
      $and: [{ quantity: { $lt: 5 } }, { number: { $mod: [3, 1] } }]
    })
  })

  it('should return empty object for bad filter expressions provided', async () => {
    const result = await filterBuilder.build(['name.en:lt:ali', 'title:post:'])

    expect(result).to.eql({})
  })
})
