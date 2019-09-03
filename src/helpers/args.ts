const argv = require('minimist')(process.argv.slice(2))

const nonFlags: any = {}
// TODO: Add a way to metadata so we can skip it from there instead of harcoding
const CONFIRMED_BOOLEAN_FLAGS = ['f', 'follow']

const getFlagArguments = () => {
  const keys = Object.keys(argv)
  const flags: any = {}
  for (const key of keys) {
    if (key === '_') {
      continue
    }
    if (CONFIRMED_BOOLEAN_FLAGS.includes(key)) {
      nonFlags[argv[key]] = true
      flags[key] = true
    } else {
      flags[key] = argv[key]
    }
  }
  return flags
}

const getNonFlagArguments = () => {
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
