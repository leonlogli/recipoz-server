import { supportedLanguages, I18NRecord } from '..'

const I18NString: I18NRecord<StringConstructor> = {}
const I18NNumber: I18NRecord<NumberConstructor> = {}

supportedLanguages.forEach(lang => {
  I18NString[lang] = String
  I18NNumber[lang] = Number
})

const I18NUniqueString = (fieldName: string) => {
  const res: I18NRecord<any> = {}

  supportedLanguages.forEach(lang => {
    res[lang] = {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: {
          [`${fieldName}.${lang}`]: { $type: 'string' }
        }
      }
    }
  })

  return res
}

const buildSingleTextIndex = (opt: Record<string, number>) => {
  const indexes: Record<string, string> = {}
  const weights: Record<string, number> = {}
  const field = Object.keys(opt)[0]
  const weight = Object.values(opt)[0]
  const fieldPaths = field.split('.')

  if (fieldPaths.pop() === '*') {
    const path = `${fieldPaths.join('.')}`

    supportedLanguages.forEach(lang => {
      indexes[`${path}.${lang}`] = 'text'
      weights[`${path}.${lang}`] = weight
    })
  } else {
    indexes[field] = 'text'
    weights[field] = weight
  }

  return { indexes, weights }
}

const createTextIndex = (...options: Record<string, number>[] | string[]) => {
  let indexes: Record<string, string> = {}
  let weights: Record<string, string> = {}

  options.forEach((opt: any, i: number) => {
    let res: any = {}

    if (typeof opt === 'string') {
      res = buildSingleTextIndex({ [opt]: options.length - i })
    } else res = buildSingleTextIndex(opt)

    indexes = { ...indexes, ...res.indexes }
    weights = { ...weights, ...res.weights }
  })

  return { indexes, weights }
}

const modelNames = [
  'Account',
  'User',
  'Notification',
  'Recipe',
  'RecipeSource',
  'AbuseReport',
  'Category',
  'Comment',
  'RecipeCollection',
  'ShoppingListItem'
] as const

export type ModelName = typeof modelNames[number]

export { I18NString, I18NNumber, I18NUniqueString, createTextIndex }
