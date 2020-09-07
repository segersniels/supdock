import { version } from 'package';
import { default as metadata, Commands } from 'metadata';

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

export const generateFlagDescriptions = (command: string) => {
  const descriptions: string[] = [];

  if (metadata[command] && metadata[command].flags) {
    for (const flag of metadata[command].flags!) {
      if (flag.length === 1) {
        descriptions.push(`      --${flag[0]}`);
      } else {
        descriptions.push(`  -${flag[0]}, --${flag[1]}`);
      }
    }
  }

  return descriptions.join('\n');
};

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
