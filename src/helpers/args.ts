const argv = require('minimist')(process.argv.slice(2))

const getFlagArguments = () => {
  const keys = Object.keys(argv)
  const flags: any = {}
  for (const key of keys) {
    if (key === '_') {
      continue
    }
    flags[key] = argv[key]
  }
  return flags
}

const getNonFlagArguments = () => {
  const nonFlags: any = {}
  for (const key of argv._.slice(1, argv._.length)) {
    nonFlags[key] = true
  }
  return nonFlags
}

export const parseArguments = () => {
  return {
    command: argv._[0],
    flags: getFlagArguments(),
    nonFlags: getNonFlagArguments()
  }
}
