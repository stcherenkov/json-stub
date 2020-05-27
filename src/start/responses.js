const _ = require('lodash')

const METHODS = {
  GET: Symbol('GET'),
  POST: Symbol('POST'),
  PUT: Symbol('PUT'),
  DELETE: Symbol('DELETE'),
}

const DEFAULT_RESPONSE = {
  status: 200,
  headers: {},
  body: '{}',
}

const tree = {}

const add = (
  method,
  path,
  response,
) => {
  const treePath = [...path, METHODS[method.toUpperCase()]]
  const prevResponse = _.get(tree, treePath)
  const nextResponse = _.defaultsDeep(response, prevResponse, DEFAULT_RESPONSE)

  _.set(tree, treePath, nextResponse)
}

const remove = (
  method,
  path,
  keys,
) => {
  const treePath = [...path, METHODS[method.toUpperCase()]]

  if (!keys) {
    _.set(tree, treePath, null)
  } else {
    const emptyKeys = _.zipObject(
      keys,
      Array(keys.length).fill(null)
    )
    const prevResponse = _.get(tree, treePath)
    const nextResponse = _.defaultsDeep(emptyKeys, prevResponse)

    _.set(tree, treePath, nextResponse)
  }
}

const match = (
  method,
  path,
) => {
  const methodSymbol = METHODS[method.toUpperCase()]

  const found = path.reduce(
    ({ subtree, params }, part) => {
      if (!subtree) {
        return {
          subtree,
          params,
        }
      }

      if (subtree[part]) {
        return {
          subtree: subtree[part],
          params,
        }
      }

      const paramKey = Object.keys(subtree).find((key) => key.startsWith(':'))

      if (paramKey) {
        return {
          subtree: subtree[paramKey],
          params: {
            ...params,
            [paramKey.substr(1)]: part,
          },
        }
      }

      return {
        subtree: null,
        params,
      }
    },
    {
      subtree: tree,
      params: {},
    }
  )

  if (!found.subtree || !found.subtree[methodSymbol]) {
    return null
  }

  return {
    ...found.subtree[methodSymbol],
    params: found.params,
  }
}

module.exports = {
  tree,
  add,
  remove,
  match,
}
