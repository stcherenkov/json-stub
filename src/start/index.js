module.exports = ({
  root,
  port,
}) => {
  require('./watcher')({ root })
  require('./server')({ port })
}
