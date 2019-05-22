#!/usr/bin/env node
import Supdock from './src';
import { parseArguments } from './src/helpers/args';

const supdock = new Supdock();
const { command, flags, nonFlags } = parseArguments();

// Prompt is enabled when no extra arguments are passed besides the command and flags
const promptEnabled = Object.keys(nonFlags).length === 0;

// Output usage
if (flags.help || flags.h) {
  if (command) {
    supdock.usage(command);
  } else {
    supdock.usage();
  }
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
      supdock.execute('stats', 'ps');
    } else {
      supdock.default();
    }
    break;
  }
  case 'logs': {
    if (promptEnabled && Object.keys(flags).length === 0) {
      supdock.execute('logs', 'psa');
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
        supdock.execute('stop', 'ps');
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
        supdock.execute('start', 'psaStopped');
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
        supdock.execute('restart', 'ps');
      }
    } else {
      supdock.default();
    }
    break;
  }
  case 'logs': {
    if (promptEnabled) {
      supdock.execute('logs', 'psa');
    } else {
      supdock.default();
    }
    break;
  }
  case 'rm': {
    if (promptEnabled) {
      supdock.execute('rm', 'psa');
    } else {
      supdock.default();
    }
    break;
  }
  case 'rmi': {
    if (promptEnabled) {
      supdock.execute('rmi', 'images');
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
      supdock.execute('ssh', 'ps');
    } else {
      supdock.default();
    }
    break;
  }
  case 'history': {
    if (promptEnabled) {
      supdock.execute('history', 'images');
    } else {
      supdock.default();
    }
    break;
  }
  case 'inspect': {
    if (promptEnabled) {
      supdock.execute('inspect', 'ps');
    } else {
      supdock.default();
    }
    break;
  }
  case 'env': {
    if (promptEnabled) {
      supdock.execute('env', 'ps');
    } else {
      supdock.default();
    }
    break;
  }
  default: {
    supdock.default();
  }
}
