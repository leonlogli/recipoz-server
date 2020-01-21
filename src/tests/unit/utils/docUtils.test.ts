import { expect } from 'chai'
import {
  transformDoc,
  transformDocs,
  buildListDataResponse
} from '../../../utils'

describe('doc utils', () => {
  it('should transform i18n doc', () => {
    const doc = { _id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 }
    const result = transformDoc(doc, ['name'])

    expect(result).to.eql({ id: 1, name: 'value', age: 19 })
  })

  it('should transform nullable doc', () => {
    expect(transformDoc(null, ['name'])).to.equal(null)
  })

  it('should transform i18n doc with deep sub docs', () => {
    const author = {
      _id: 5,
      name: 'Ali',
      profile: { country: { fr: 'Maroc', en: 'Morocco' } },
      notifications: [
        { _id: 551, type: 'alert', title: 'Recipoz !' },
        { _id: 552, type: 'popup', title: 'Open !' }
      ]
    }
    const book = {
      _id: 32,
      title: { en: 'Learn JS', fr: 'Apprendre JS' },
      note: 8,
      author
    }
    const doc = { _id: 1, title: { en: 'value' }, age: 19, book }

    const result = transformDoc(doc, ['title', 'country'])

    expect(result).to.eql({
      id: 1,
      title: 'value',
      age: 19,
      book: {
        id: 32,
        title: 'Learn JS',
        note: 8,
        author: {
          id: 5,
          name: 'Ali',
          profile: { country: 'Morocco' },
          notifications: [
            { id: 551, type: 'alert', title: 'Recipoz !' },
            { id: 552, type: 'popup', title: 'Open !' }
          ]
        }
      }
    })
  })

  it('should transform array of i18n docs', () => {
    const docs = [
      { _id: 1, name: { en: 'value', fr: 'valeur' }, age: 19 },
      { _id: 2, name: { en: 'value 2', fr: 'valeur 2' }, age: 31 }
    ]
    const result = transformDocs(docs, ['name'])

    expect(result).to.eql([
      { id: 1, name: 'value', age: 19 },
      { id: 2, name: 'value 2', age: 31 }
    ])
  })

  it('should transform array of i18n docs with subDocs', () => {
    const subDocs = [
      { _id: 32, name: { en: 'sub', fr: 'sous' }, age: 47 },
      { _id: 33, name: { en: 'sub', fr: 'sous' }, age: 47 }
    ]
    const docs = [
      { _id: 1, name: { en: 'value', fr: 'valeur' }, age: 19, subDocs },
      { _id: 2, name: { en: 'value 2', fr: 'valeur 2' }, age: 31 }
    ]

    const result = transformDocs(docs, ['name', 'subdocs.name'])

    expect(result).to.eql([
      {
        id: 1,
        name: 'value',
        age: 19,
        subDocs: [
          { id: 32, name: 'sub', age: 47 },
          { id: 33, name: 'sub', age: 47 }
        ]
      },
      { id: 2, name: 'value 2', age: 31 }
    ])
  })

  it('should build pageable response', () => {
    const categories = [{ name: 'value 1' }, { name: 'value 2' }]
    const result = buildListDataResponse(categories, 100, {
      number: 1,
      size: 20
    })

    expect(result).to.eql({
      content: [{ name: 'value 1' }, { name: 'value 2' }],
      page: {
        number: 1,
        size: 20,
        count: 5
      },
      totalElements: 100
    })
  })
})
