import { execSync, spawn, spawnSync } from 'child_process';
import * as inquirer from 'inquirer';
import { version } from '../package.json';
import { IdCommands, NameCommands } from './enums';
import { info, logAndForget, warn } from './helpers/logger';
import metadata from './metadata';
import Type from './types/type';

export default class Supdock {
  private commands: any;

  constructor() {
    this.commands = metadata;
  }

  public async run(args: any) {
    const { type, flags } = this.commands[args.command];

    // Fire and forget the following commands in background when 'all' is passed as nonFlag
    if (
      args.nonFlags.all &&
      ['start', 'restart', 'stop'].includes(args.command)
    ) {
      this.executeInParallel(args.command, type);
      return;
    }

    const promptEnabled =
      Object.keys(args.nonFlags).length === 0 ||
      args.flags.p ||
      args.flags.prompt;
    const passedFlags = Object.keys(args.flags);
    const allowedFlags = [].concat
      .apply([], flags)
      .map((flag: string) => flag.replace(/-/g, ''));

    // When flag passed is not a valid custom flag or other arguments are being passed default to normal docker
    if (
      (passedFlags.length > 0 &&
        !passedFlags.find(flag => allowedFlags.includes(flag))) ||
      !promptEnabled
    ) {
      this.default();
      return;
    }

    // When every check has passed, perform the rest of customised supdock command
    await this.execute(args.command, type, this.parseFlags(args.flags));
  }

  public default(options: string[] = process.argv.slice(2)) {
    this.spawn('docker', options);
  }

  public usage(command?: string) {
    if (!command) {
      const descriptions = this.generateCommandDescriptions();
      logAndForget(`NAME:
  \tsupdock - What's Up Dock(er)?

  USAGE:
  \tsupdock [global options] command [command options] [arguments...]

  VERSION:
  \t${version}

  COMMANDS:
  ${descriptions}
  \thelp, h\t\tShows a list of commands or help for one command

  GLOBAL OPTIONS:
  \t--help, -h\tshow help
  \t--version, -v\tprint the version
      `);
    } else {
      // Output the default docker help
      this.default();

      // Only log extra stuff if there are actual custom flags for the command
      const flagDescriptions = this.generateFlagDescriptions(command);
      if (flagDescriptions.length > 0) {
        logAndForget(`\nPrompt Enabled:\n${flagDescriptions}`);
      }
      process.exit(0);
    }
  }

  public version() {
    logAndForget(version);
  }

  public getCustomCommands() {
    return Object.keys(this.commands);
  }

  private executeInParallel(command: string, type: Type) {
    info('Asynchronous execution of command is happening in the background');
    info(`Some containers might take longer than others to ${command}`, true);
    spawn;

    const { ids } = this.getDockerInfo(type);
    ids.forEach(id => {
      const child = spawn('docker', [command, id], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });
  }

  private async execute(command: string, type: Type, flags: string[] = []) {
    const { ids, names } = this.getDockerInfo(type);
    const { question, error } = this.commands[command];

    if (ids.length > 0) {
      const choices = this.createChoices(ids, names);
      const { choice: container } = await this.prompt(question, choices);
      const id = container.split('-')[0].trim();

      // Define custom command logic if needed
      switch (command) {
        case 'ssh': {
          await this.ssh(id);
          break;
        }
        case 'env':
          this.spawn('docker', ['exec', '-ti', id, 'env']);
          break;
        case 'stop':
          if (flags.includes('-f') || flags.includes('--force')) {
            this.spawn('docker', ['rm', ...flags, id]);
          } else {
            this.spawn('docker', [command, ...flags, id]);
          }
          break;
        default:
          this.spawn('docker', [command, ...flags, id]);
      }
    } else {
      warn(error);
    }
  }

  private parseFlags(flags: any) {
    const parsed: any[] = [];
    for (const flag of Object.keys(flags)) {
      parsed.push(flag.length > 1 ? `--${flag}` : `-${flag}`);
      // If flag has a value that is not a boolean add it to the array
      if (typeof flags[flag] !== 'boolean') {
        parsed.push(flags[flag]);
      }
    }
    return parsed;
  }

  private generateCommandDescriptions() {
    const commands = Object.keys(this.commands);
    return commands
      .map(command => `\t${command}\t\t${this.commands[command].description}`)
      .join('\n');
  }

  private generateFlagDescriptions(command: string) {
    return this.commands[command] && this.commands[command].flags
      ? this.commands[command].flags
          .map((flag: string) => `  ${flag[0]}, ${flag[1]}`)
          .join('\n')
      : '';
  }

  private executeFullyDeclaredCommand(command: string): string[] {
    return execSync(command, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  private getDockerInfo(type: Type) {
    const ids = this.executeFullyDeclaredCommand(IdCommands[type]);
    const names = this.executeFullyDeclaredCommand(NameCommands[type]);
    return { ids, names };
  }

  private createChoices(ids: string[], names: string[]) {
    return ids.map((id: string, index: number) => `${id} - ${names[index]}`);
  }

  private spawn(command: string, args: string[]) {
    spawnSync(command, args, { stdio: 'inherit' });
  }

  private async ssh(id: string) {
    await this.prompt('Which shell is the container using?', [
      'bash',
      'ash',
    ]).then((answer: any) => {
      this.spawn('docker', ['exec', '-ti', id.trim(), answer.choice]);
    });
  }

  private prompt(message: string, choices: string[]): any {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message,
        choices,
      },
    ]);
  }
}
