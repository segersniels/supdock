#!/usr/bin/env node
import { version } from './package.json';
import * as program from 'commander';
import Supdock from './src/supdock';

const supdock = new Supdock();

program
  .version(version)
  .option('-f, --force')
  .option('-D, --debug')
  .option('-H, --host <list>')
  .option('-l, --log-level')
  .option('--config')
  .option('--no-stream');

program
  .command('stop')
  .description('Stop a running container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined' || process.argv[3] === 'all') {
      if (process.argv[3] === 'all') {
        supdock.executeInParallel('stop', 'ps');
      } else {
        supdock.execute(
          'stop',
          'Which container would you like to stop?',
          'supdock: no containers available to stop',
          'ps',
        );
      }
    } else {
      supdock.passthrough();
    }
  });

program
  .command('start')
  .description('Start a stopped container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined' || process.argv[3] === 'all') {
      if (process.argv[3] === 'all') {
        supdock.executeInParallel('start', 'psaStopped');
      } else {
        supdock.execute(
          'start',
          'Which container would you like to start?',
          'supdock: no containers available to start',
          'psaStopped',
        );
      }
    } else {
      supdock.passthrough();
    }
  });

program
  .command('restart')
  .description('Restart a running container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined' || process.argv[3] === 'all') {
      if (process.argv[3] === 'all') {
        supdock.executeInParallel('restart', 'psaStopped');
      } else {
        supdock.execute(
          'restart',
          'Which container would you like to restart?',
          'supdock: no containers available to restart',
          'ps',
        );
      }
    } else {
      supdock.passthrough();
    }
  });

program
  .command('logs')
  .description('See the logs of a container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'logs',
        'Which container would you like to see the logs of?',
        'supdock: no containers to see the logs of',
        'psa',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('rm')
  .description('Remove a container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'rm',
        'Which container would you like to remove?',
        'supdock: no containers to remove',
        'psa',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('rmi')
  .description('Remove an image')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'rmi',
        'Which image would you like to remove?',
        'supdock: no images to remove',
        'images',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('prune')
  .description('Remove stopped containers and dangling images')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.passthrough(['system', 'prune', '-f']);
    } else {
      supdock.passthrough();
    }
  });

program
  .command('stats')
  .description('See the stats of a container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'stats',
        'Which containers would you like to see that stats of?',
        'supdock: no containers available',
        'ps',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('ssh')
  .description('SSH into a container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'ssh',
        'Which container would you like to SSH to?',
        'supdock: no containers available',
        'ps',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('history')
  .description('See the history of an image')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'history',
        'Which image would you like to see the history of?',
        'supdock: no images available',
        'images',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('inspect')
  .description('Inspect a container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'inspect',
        'Which image would you like to inspect?',
        'supdock: no containers to inspect',
        'ps',
      );
    } else {
      supdock.passthrough();
    }
  });

program
  .command('env')
  .description('See the environment variables of a running container')
  .action(() => {
    if (typeof process.argv[3] === 'undefined') {
      supdock.execute(
        'env',
        'Which container would you like to see the environment variables of?',
        'supdock: no containers running',
        'ps',
      );
    } else {
      supdock.passthrough();
    }
  });

program.parse(process.argv);

const commands = program.commands.map((command: any) => command._name);

if (!commands.includes(process.argv[2])) {
  supdock.passthrough();
}
