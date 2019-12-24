import { version } from '../../package.json';
import Commands from '../types/Commands.js' /* eslint-disable-line */

const generateCommandDescriptions = (
  commands: Commands,
  commandNames: string[],
) => {
  return commandNames
    .map(command => `\t${command}\t\t${commands[command].description}`)
    .join('\n');
};

export const generateGeneralDescription = (
  commands: Commands,
  commandNames: string[],
) => {
  const commandDescriptions = generateCommandDescriptions(
    commands,
    commandNames,
  );
  return `NAME:
\tsupdock - What's Up Dock(er)?

USAGE:
\tsupdock [global options] command [command options] [arguments...]

VERSION:
\t${version}

COMMANDS:
${commandDescriptions}
\thelp, h\t\tShows a list of commands or help for one command

GLOBAL OPTIONS:
\t--help, -h\tshow help
\t--version, -v\tprint the version`;
};

export const generateFlagDescriptions = (
  commands: Commands,
  command: string,
) => {
  const descriptions: string[] = [];
  if (commands[command] && commands[command].flags) {
    for (const flag of commands[command].flags!) {
      if (flag.length === 1) {
        descriptions.push(`      --${flag[0]}`);
      } else {
        descriptions.push(`  -${flag[0]}, --${flag[1]}`);
      }
    }
  }
  return descriptions.join('\n');
};

/* eslint-disable no-tabs */
export const generateCustomCommandDescription = (
  command: string,
  description: string,
  options: any | undefined,
) => {
  let customCommandDescription = `\nUsage:	docker ${command} [OPTIONS]\n\n  ${description}\n\n`;
  if (options && Object.keys(options).length) {
    const availableOptions = Object.keys(options).map(
      key => `${key}  (${options[key]})`,
    );
    customCommandDescription += `Options:
    ${availableOptions.join('\n    ')}`;
  }
  return customCommandDescription;
};
