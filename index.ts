#!/usr/bin/env node
import { parseArguments } from 'helpers/args';
import { log } from 'helpers/util';
import { generateGeneralDescription } from 'helpers/description';
import metadata from 'metadata';

const run = async () => {
  const { command, flags } = parseArguments();

  if ((flags.help || flags.h) && !command) {
    const commands = Object.keys(metadata);
    return log(generateGeneralDescription(metadata, commands));
  }

  if ((flags.version || flags.v) && !command) {
    await new (await import('commands/docker')).default(command).version();
  }

  // Ugly repetitive code since pkg doesn't work well with dynamic importing
  switch (command) {
    case 'stats':
      await new (await import('commands/stats')).default().run();
      break;
    case 'ssh':
      await new (await import('commands/ssh')).default().run();
      break;
    case 'prune':
      await new (await import('commands/prune')).default().run();
      break;
    case 'env':
      await new (await import('commands/env')).default().run();
      break;
    case 'stop':
      await new (await import('commands/stop')).default().run();
      break;
    case 'logs':
      await new (await import('commands/logs')).default().run();
      break;
    case 'enable':
    case 'disable':
      await new (await import('commands/config')).default(command).run();
      break;
    case 'cat':
      await new (await import('commands/cat')).default().run();
      break;
    default:
      await new (await import('commands/docker')).default(command).run();
  }
};

run();
