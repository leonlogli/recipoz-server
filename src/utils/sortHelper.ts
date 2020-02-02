import { supportedLanguages, i18n } from './i18n'

/**
 * Append supported local on every i18n sort field. Ex: 'name' became 'name.fr name.en'
 * @param sort sort directives
 * @param i18nFields i18n fields
 */
const buildSortDirectives = (sort?: string, i18nFields?: string[]) => {
  if (!i18nFields || !i18nFields.length || !sort || !sort.trim()) {
    return sort
  }

  return sort
    .split(' ')
    .map(item => {
      if (i18nFields.includes(item)) {
        return Array.from(supportedLanguages)
          .sort((a, _b) => (a === i18n.currentLanguage ? -1 : 0))
          .map(lang => `${item}.${lang}`)
          .join(' ')
      }

      return item
    })
    .join(' ')
}

/**
 * Convert sort directives to object.
 * Ex: sortDirectivesToObject('title -name') returns { title: 1, name: -1 }
 * @param sortDirectives sort directives. Ex: 'title -name'
 */
const sortDirectivesToObject = (sortDirectives?: string) => {
  if (!sortDirectives) {
    return {}
  }
  const result: any = {}

  sortDirectives.split(' ').forEach(item => {
    if (item.startsWith('-')) {
      result[item.substring(1, item.length)] = -1
    } else result[item] = 1
  })

  return result
}

export { buildSortDirectives, sortDirectivesToObject }
