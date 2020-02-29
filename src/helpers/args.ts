import metadata from 'metadata';
import flatten = require('lodash.flatten');
const argv = require('minimist')(process.argv.slice(2));

const nonFlags: string[] = [];

const getFlagArguments = () => {
  const command = argv._[0];
  const keys = Object.keys(argv);
  const flags: any = {};
  for (const key of keys) {
    if (key === '_') {
      continue;
    }
    // Make sure we correctly parse custom flags, for now these are boolean flags so parse them correctly
    if (command && metadata[command] && metadata[command].flags) {
      const commandFlags = flatten(metadata[command].flags);
      if (commandFlags.includes(key)) {
        if (typeof argv[key] !== 'boolean' && !nonFlags.includes(argv[key])) {
          nonFlags.push(argv[key]);
        }
        flags[key] = true;
        continue;
      }
    }
    flags[key] = argv[key];
  }
  return flags;
};

const getNonFlagArguments = () => {
  for (const key of argv._.slice(1, argv._.length)) {
    if (nonFlags.includes(key)) {
      continue;
    }

    nonFlags.push(key);
  }
  return nonFlags;
};

export const parseArguments = () => {
  return {
    command: argv._[0],
    flags: getFlagArguments(),
    nonFlags: getNonFlagArguments(),
  };
};
