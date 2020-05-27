#!/usr/bin/env node

const path = require('path')

require('yargs')
  .command('start [root]', 'start the stub server', (yargs) => {
    yargs
      .positional('root', {
        describe: 'Root directory. Relative would be resolved from your working directory',
        default: './stub',
        coerce: (arg) =>
          arg.startsWith('.')
            ? path.resolve(process.cwd(), arg)
            : arg,
      })
      .option('port', {
        describe: 'Port to bind on',
        default: 3030
      })
  }, (argv) => {
    require('./src/start')(argv)
  })
  .demandCommand()
  .recommendCommands()
  .strict()
  .parse()
