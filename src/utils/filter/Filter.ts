import FilterBase from './FilterBase'

import { hasOwnProperty, findDocAndSelectOnlyIds } from '..'

class Filter extends FilterBase {
  protected refDoc(path: string) {
    return this.refDocs?.find(ref =>
      Object.keys(ref)[0].startsWith(path.split('.')[0])
    )
  }

  protected mapModelNamesToFilterPaths = (
    refPath: string,
    refModelNames: string[],
    _filterPath: string
  ) => {
    let filterPath = _filterPath
    const modelNameToPathMaps = []
    const refPathArray = refPath.split('/')

    filterPath = filterPath.replace(`${refPathArray[0]}.`, '')

    for (let i = 0; i < refPathArray.length; ++i) {
      const path = refPathArray[i + 1]
      const refModelName = refModelNames[i]

      if (filterPath.startsWith(path)) {
        modelNameToPathMaps.push({ [refModelName]: path })
        filterPath = filterPath.replace(`${path}.`, '')
      } else {
        modelNameToPathMaps.push({ [refModelName]: filterPath })
        break
      }
    }

    return modelNameToPathMaps
  }

  protected buildRefCriteria = async (
    filterPath: string,
    filterValue: any,
    refDoc: Record<string, string>
  ) => {
    const refPath = Object.keys(refDoc)[0]
    const refModelNames = refDoc[refPath].split('/')
    const modelNameToPaths = this.mapModelNamesToFilterPaths(
      refPath,
      refModelNames,
      filterPath
    )
    let ids: any[] = []

    for (let i = modelNameToPaths.length; i--; ) {
      const modelName = Object.keys(modelNameToPaths[i])[0]
      const path = modelNameToPaths[i][modelName]
      const val = i === modelNameToPaths.length - 1 ? filterValue : { $in: ids }

      ids = await findDocAndSelectOnlyIds({ [path]: val }, modelName)
    }

    return { path: refPath.split('/')[0], value: { $in: ids } }
  }

  protected getPathAndValue = async (filter: string) => {
    let { path, value } = this.extractFilterElements(filter)

    if (!path.includes('.')) {
      return { path, value }
    }
    const refDoc = this.refDoc(path)

    if (refDoc) {
      const { path: p, value: v } = await this.buildRefCriteria(
        path,
        value,
        refDoc
      )

      path = p
      value = v
    }

    return { path, value }
  }

  build = async (filterCriteria: string[]) => {
    if (!filterCriteria) {
      return filterCriteria
    }
    const result: any = {}

    for (const filter of filterCriteria) {
      const metaOp = FilterBase.metaOperators.find(op => filter.startsWith(op))

      if (metaOp) {
        const subFilters = filter.slice(metaOp.length + 2, -1).split(';')

        if (!result[`$${metaOp}`]) {
          result[`$${metaOp}`] = []
        }
        for (const subFilter of subFilters) {
          result[`$${metaOp}`].push(await this.build([subFilter]))
        }
      } else {
        const { path, value } = await this.getPathAndValue(filter)

        if (path && value) {
          if (hasOwnProperty(result, path)) {
            result[path] = { ...result[path], ...value }
          } else result[path] = value
        }
      }
    }

    return result
  }
}

export { Filter }
export default Filter
