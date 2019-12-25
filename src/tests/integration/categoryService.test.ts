import { expect } from 'chai'
import { categoryService } from '../../services'

const category = {
  subCategory: { type: 'DIET' },
  name: { en: 'test' },
  thumbnail: 'https://cloudinary.com/test.jpg'
}

describe('Category services ', () => {
  it('should save category', async () => {
    const c = await categoryService.addCategory(category)

    console.log(c.thumbnail)

    expect(c).to.deep.include({
      subCategory: { type: 'DIET' },
      name: 'test',
      thumbnail: 'https://cloudinary.com/test.jpg'
    })
  })
})
