const path = require('path')

const pathToEndpoint = (root, filepath) => {
  const relativePath = path.relative(root, path.dirname(filepath))
  return {
    url: '/' + relativePath,
    path: relativePath === ''
      ? ['/']
      : relativePath.split(path.sep),
    method: path.basename(filepath, path.extname(filepath)),
  }
}

module.exports = pathToEndpoint
