#!/usr/bin/env node
import { parseArguments } from 'helpers/args';
import { log } from 'helpers/util';
import { generateGeneralDescription } from 'helpers/description';
import metadata from 'metadata';

// Commands
import Docker from 'commands/docker';
import Ssh from 'commands/ssh';
import Logs from 'commands/logs';
import Config from 'commands/config';
import Env from 'commands/env';
import Prune from 'commands/prune';
import Stop from 'commands/stop';

const run = async () => {
  const { command, flags } = parseArguments();

  if ((flags.help || flags.h) && !command) {
    const commands = Object.keys(metadata);
    return log(generateGeneralDescription(metadata, commands));
  }

  if ((flags.version || flags.v) && !command) {
    return new Docker(command).version();
  }

  // Ugly repetitive code since pkg doesn't work well with dynamic importing
  switch (command) {
    case 'ssh':
      await new Ssh().run();
      break;
    case 'prune':
      await new Prune().run();
      break;
    case 'env':
      await new Env().run();
      break;
    case 'stop':
      await new Stop().run();
      break;
    case 'logs':
      await new Logs().run();
      break;
    case 'enable':
    case 'disable':
      await new Config(command).run();
      break;
    default:
      await new Docker(command).run();
  }
};

run();
