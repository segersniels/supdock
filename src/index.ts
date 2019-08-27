import { execSync, spawn, spawnSync } from 'child_process';
import * as inquirer from 'inquirer';
import { version } from '../package.json';
import { info, logAndForget, warn } from './helpers/logger';
import metadata from './metadata';

export default class Supdock {
  private commands: any;

  constructor () {
    this.commands = metadata;
  }

  public async run (args: any) {
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
    const allowedFlags: string[] = [].concat.apply([], flags);

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
    await this.execute(
      args.command,
      type,
      this.parseFlags(args.flags, allowedFlags)
    );
  }

  public default (options: string[] = process.argv.slice(2)) {
    this.spawn('docker', options);
  }

  public usage (command?: string) {
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
      this.commandUsage(command);
    }
  }

  public version () {
    logAndForget(version);
  }

  public getCustomCommands () {
    return Object.keys(this.commands);
  }

  private commandUsage (command: string) {
    // Output the default docker help
    this.default();

    // Only log extra stuff if there are actual custom flags for the command
    const flagDescriptions = this.generateFlagDescriptions(command);
    if (flagDescriptions.length > 0) {
      const metadata = this.commands[command];
      info(`\nOptions (supdock):\n${flagDescriptions}`);
      if (metadata.extraUsageInfo) {
        info(`\n${metadata.extraUsageInfo}`);
      }
    }

    process.exit(0);
  }

  private executeInParallel (command: string, type: string) {
    info('Asynchronous execution of command is happening in the background');
    info(`Some containers might take longer than others to ${command}`, true);

    const ids = this.createChoices(type).map(choice =>
      choice.split('-')[0].trim()
    );
    ids.forEach(id => {
      const child = spawn('docker', [command, id], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
    });
  }

  private parseFlags (flags: any, allowedFlags: string[]) {
    const parsed: any[] = [];

    for (const flag of Object.keys(flags)) {
      // If prompt flag has been passed and is allowed for the command strip it from the further execution flags
      if (['p', 'prompt'].includes(flag) && allowedFlags.includes(flag)) {
        continue;
      }

      // Minimist parses --no-<flag> variables to a boolean flag with value false with the --no prefix stripped
      // So we have to readd the prefix
      if (allowedFlags.includes(`no-${flag}`) && !flags[flag]) {
        parsed.push(`--no-${flag}`);
        continue;
      }

      // Normal flag behaviour
      parsed.push(flag.length > 1 ? `--${flag}` : `-${flag}`);

      // If flag has a value that is not a boolean add it to the array
      if (typeof flags[flag] !== 'boolean') {
        parsed.push(flags[flag]);
      }
    }

    return parsed;
  }

  private generateCommandDescriptions () {
    const commands = Object.keys(this.commands);
    return commands
      .map(command => `\t${command}\t\t${this.commands[command].description}`)
      .join('\n');
  }

  private generateFlagDescriptions (command: string) {
    const descriptions: string[] = [];
    if (this.commands[command] && this.commands[command].flags) {
      for (const flag of this.commands[command].flags) {
        if (flag.length === 1) {
          descriptions.push(`      --${flag[0]}`);
        } else {
          descriptions.push(`  -${flag[0]}, --${flag[1]}`);
        }
      }
    }
    return descriptions.join('\n');
  }

  private executeFullyDeclaredCommand (command: string): string[] {
    return execSync(command, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  private spawn (command: string, args: string[]) {
    spawnSync(command, args, { stdio: 'inherit' });
  }

  private createChoices (type: string) {
    return this.executeFullyDeclaredCommand(type);
  }

  private prompt (message: string, choices: string[]): any {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message,
        choices
      }
    ]);
  }

  private async ssh (id: string) {
    await this.prompt('Which shell is the container using?', [
      'bash',
      'ash'
    ]).then((answer: any) => {
      this.spawn('docker', ['exec', '-ti', id.trim(), answer.choice]);
    });
  }

  private async execute (command: string, type: string, flags: string[] = []) {
    const { question, error } = this.commands[command];

    // Special custom commands without prompt
    if (!question && !error) {
      switch (command) {
      case 'prune':
        this.spawn('docker', ['system', 'prune', '-f']);
        return;
      }
    }

    const choices = this.createChoices(type);
    if (choices.length > 0) {
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
}
