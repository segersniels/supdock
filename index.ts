#!/usr/bin/env node
import Supdock from './src';
import { parseArguments } from './src/helpers/args';

const supdock = new Supdock();
const { command, flags, nonFlags } = parseArguments();
const promptEnabled = Object.keys(nonFlags).length === 0;

// Output usage
if (flags.help || flags.h) {
  supdock.usage();
}

// Output version information
if (flags.version || flags.v) {
  supdock.version();
}

// Fallback to default Docker execution if command is unknown to Supdock
if (!supdock.getCustomCommands().includes(command)) {
  supdock.default();
}

switch (command) {
  case 'stats': {
    if (flags.prompt || flags.p) {
      supdock.execute(
        'stats',
        'Which containers would you like to see that stats of?',
        'supdock: no containers available',
        'ps',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'logs': {
    if (promptEnabled && Object.keys(flags).length === 0) {
      supdock.execute(
        'logs',
        'Which container would you like to see the logs of?',
        'supdock: no containers to see the logs of',
        'psa',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'stop': {
    if (promptEnabled || nonFlags.all) {
      if (nonFlags.all) {
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
      supdock.default();
    }
    break;
  }
  case 'start': {
    if (promptEnabled || nonFlags.all) {
      if (nonFlags.all) {
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
      supdock.default();
    }
    break;
  }
  case 'restart': {
    if (promptEnabled || nonFlags.all) {
      if (nonFlags.all) {
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
      supdock.default();
    }
    break;
  }
  case 'logs': {
    if (promptEnabled) {
      supdock.execute(
        'logs',
        'Which container would you like to see the logs of?',
        'supdock: no containers to see the logs of',
        'psa',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'rm': {
    if (promptEnabled) {
      supdock.execute(
        'rm',
        'Which container would you like to remove?',
        'supdock: no containers to remove',
        'psa',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'rmi': {
    if (promptEnabled) {
      supdock.execute(
        'rmi',
        'Which image would you like to remove?',
        'supdock: no images to remove',
        'images',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'prune': {
    if (promptEnabled) {
      supdock.default(['system', 'prune', '-f']);
    } else {
      supdock.default();
    }
    break;
  }
  case 'ssh': {
    if (promptEnabled) {
      supdock.execute(
        'ssh',
        'Which container would you like to SSH to?',
        'supdock: no containers available',
        'ps',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'history': {
    if (promptEnabled) {
      supdock.execute(
        'history',
        'Which image would you like to see the history of?',
        'supdock: no images available',
        'images',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'inspect': {
    if (promptEnabled) {
      supdock.execute(
        'inspect',
        'Which image would you like to inspect?',
        'supdock: no containers to inspect',
        'ps',
      );
    } else {
      supdock.default();
    }
    break;
  }
  case 'env': {
    if (promptEnabled) {
      supdock.execute(
        'env',
        'Which container would you like to see the environment variables of?',
        'supdock: no containers running',
        'ps',
      );
    } else {
      supdock.default();
    }
    break;
  }
  default: {
    supdock.default();
  }
}
