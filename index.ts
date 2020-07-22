#!/usr/bin/env node
import { parseArguments } from 'helpers/args';
import { log } from 'helpers/util';
import { generateGeneralDescription } from 'helpers/description';
import metadata from 'metadata';

interface SimplifiedExec {
  run: () => Promise<any>;
  usage: () => void;
  version: () => void;
}

(async () => {
  const { command, flags } = parseArguments();

  // Ugly repetitive code since pkg doesn't work well with dynamic importing
  let exec: SimplifiedExec;
  switch (command) {
    case 'stats':
      exec = new (await import('commands/stats')).default();
      break;
    case 'ssh':
      exec = new (await import('commands/ssh')).default();
      break;
    case 'prune':
      exec = new (await import('commands/prune')).default();
      break;
    case 'env':
      exec = new (await import('commands/env')).default();
      break;
    case 'stop':
      exec = new (await import('commands/stop')).default();
      break;
    case 'logs':
      exec = new (await import('commands/logs')).default();
      break;
    case 'enable':
    case 'disable':
      exec = new (await import('commands/config')).default(command);
      break;
    case 'cat':
      exec = new (await import('commands/cat')).default();
      break;
    default:
      exec = new (await import('commands/docker')).default(command);
  }

  // Usage requested
  if (flags.help || flags.h) {
    if (!command) {
      const commands = Object.keys(metadata);
      return log(generateGeneralDescription(metadata, commands));
    }

    return exec.usage();
  }

  // Version requested
  if ((flags.version || flags.v) && !command) {
    return exec.version();
  }

  exec.run();
})();
