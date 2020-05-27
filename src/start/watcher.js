const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const chokidar = require('chokidar')
const Handlebars = require('handlebars')
const yaml = require('js-yaml')

const responses = require('./responses')

const pathToEndpoint = require('./pathToEndpoint')

module.exports = ({ root }) => {
  chokidar.watch(`${root}/**/*.json`)
    .on('all', (event, filepath) => {
      const endpoint = pathToEndpoint(root, filepath)

      if (event === 'unlink') {
        responses.remove(endpoint.method, endpoint.path)
        console.log(`Removed ${endpoint.method.toUpperCase()} ${endpoint.url}`)
      } else {
        readFile(filepath, 'utf8')
          .then((source) => {
            const template = Handlebars.compile(source.toString())
            responses.add(endpoint.method, endpoint.path, { template })
            console.log(`Updated ${endpoint.method.toUpperCase()} ${endpoint.url}`)
          })
          .catch((err) => {
            console.error(`Error loading ${filepath}`)
            console.error(err)
          })
      }
    })


  chokidar.watch(`${root}/**/*.yml`)
    .on('all', (event, filepath) => {
      const endpoint = pathToEndpoint(root, filepath)

      if (event === 'unlink') {
        responses.remove(endpoint.method, endpoint.path, ['status', 'headers'])
        console.log(`Unconfigured ${endpoint.method.toUpperCase()} ${endpoint.url}`)
      } else {
        readFile(filepath, 'utf8')
          .then((source) => {
            const config = yaml.safeLoad(source)

            if (config) {
              responses.add(endpoint.method, endpoint.path, {
                status: config.status,
                headers: config.headers,
              })
              console.log(`Reconfigured ${endpoint.method.toUpperCase()} ${endpoint.url}`)
            }
          })
          .catch((err) => {
            console.error(`Error loading ${filepath}`)
            console.error(err)
          })
      }
    })
}
