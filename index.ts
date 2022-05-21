#!/usr/bin/env node
import * as ArgsHelper from 'helpers/args';
import * as UtilHelper from 'helpers/util';
import * as DescriptionHelper from 'helpers/description';
import metadata from 'metadata';
import ErrorHandler, { ExecutionError } from 'helpers/errors';

interface SimplifiedExec {
  run: () => Promise<any>;
  usage: () => void;
  version: () => void;
}

(async () => {
  const { command, flags } = ArgsHelper.parseArguments();
  const errorHandler = new ErrorHandler();

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
    case 'start':
      exec = new (await import('commands/start')).default();
      break;
    case 'stop':
      exec = new (await import('commands/stop')).default();
      break;
    case 'restart':
      exec = new (await import('commands/restart')).default();
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
      const description = DescriptionHelper.generateGeneralDescription(
        metadata,
        commands,
      );

      return UtilHelper.log(description);
    }

    return exec.usage();
  }

  // Version requested
  if ((flags.version || flags.v) && !command) {
    return exec.version();
  }

  try {
    await exec.run();
  } catch (err) {
    errorHandler.catch(err as ExecutionError);
  } finally {
    // Gracefully exit
    process.exit();
  }
})();
