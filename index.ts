import { parseArguments } from './src/helpers/args';
import { log } from './src/helpers/util';
import { generateGeneralDescription } from './src/helpers/description';
import metadata from './src/metadata';

// Commands
import Docker from './src/commands/docker';
import Ssh from './src/commands/ssh';
import Logs from './src/commands/logs';
import Config from './src/commands/config';
import Env from './src/commands/env';
import Prune from './src/commands/prune';
import Stop from './src/commands/stop';

const run = async () => {
  const { command, flags } = parseArguments();

  if (flags.help || flags.h) {
    if (!command) {
      const commands = Object.keys(metadata);
      log(generateGeneralDescription(metadata, commands));
    } else {
      const docker = new Docker(command);
      docker.usage();
    }
    return;
  }

  if ((flags.version || flags.v) && !command) {
    const docker = new Docker(command);
    docker.version();
    return;
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
