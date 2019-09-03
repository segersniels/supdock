import { execSync, spawn, spawnSync } from 'child_process';
import * as inquirer from 'inquirer';
import { version } from '../package.json';
import { info, logAndForget, warn, error } from './helpers/logger';
import metadata from './metadata';
import Command from './interfaces/Command';
import Commands from './types/Commands';
import {
  generateFlagDescriptions,
  generateGeneralDescription,
} from './helpers/description';
import * as FuzzySearch from 'fuzzy-search';

export default class Supdock {
  private commands: Commands;

  constructor() {
    this.commands = metadata;
  }

  public async run(args: any) {
    const { type, flags, customPassing } = this.commands[args.command];

    // Fire and forget the following commands in background when 'all' is passed as nonFlag
    if (
      args.nonFlags.all &&
      ['start', 'restart', 'stop'].includes(args.command)
    ) {
      this.executeInParallel(args.command, type!);
      return;
    }

    const promptEnabled =
      Object.keys(args.nonFlags).length === 0 ||
      args.flags.p ||
      args.flags.prompt;
    const passedFlags = Object.keys(args.flags);
    const allowedFlags: string[] = ([] as string[]).concat.apply([], flags!);

    // When flag passed is not a valid custom flag or other arguments are being passed default to normal docker
    if (
      !customPassing &&
      ((passedFlags.length > 0 &&
        !passedFlags.find(flag => allowedFlags.includes(flag))) ||
        !promptEnabled)
    ) {
      this.default();
      return;
    }

    // When every check has passed, perform the rest of customised supdock command
    await this.execute(
      args.command,
      type!,
      this.parseFlags(args.flags, allowedFlags),
      args.nonFlags
    );
  }

  public default(options: string[] = process.argv.slice(2)) {
    this.spawn('docker', options);
  }

  public usage(command?: string) {
    if (!command) {
      const commandNames = Object.keys(this.commands);
      logAndForget(generateGeneralDescription(this.commands, commandNames));
    } else {
      this.commandUsage(command);
    }
  }

  public version() {
    logAndForget(version);
  }

  public getCustomCommands() {
    return Object.keys(this.commands);
  }

  private commandUsage(command: string) {
    // Output the default docker help
    this.default();

    // Only log extra stuff if there are actual custom flags for the command
    const flagDescriptions = generateFlagDescriptions(this.commands, command);
    if (flagDescriptions.length > 0) {
      const metadata: Command = this.commands[command];
      info(`\nOptions (supdock):\n${flagDescriptions}`);
      if (metadata.extraUsageInfo) {
        info(`\n${metadata.extraUsageInfo}`);
      }
    }

    process.exit(0);
  }

  private executeInParallel(command: string, type: string) {
    info('Asynchronous execution of command is happening in the background');
    info(`Some containers might take longer than others to ${command}`, true);

    const ids = this.createChoices(type).map(choice =>
      choice.split('-')[0].trim()
    );
    ids.forEach(id => {
      const child = spawn('docker', [command, id], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });
  }

  private parseFlags(flags: any, allowedFlags: string[]) {
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

  private executeFullyDeclaredCommand(command: string): string[] {
    return execSync(command, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  private spawn(command: string, args: string[]) {
    spawnSync(command, args, { stdio: 'inherit' });
  }

  private createChoices(type: string) {
    return this.executeFullyDeclaredCommand(type);
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

  private async ssh(id: string) {
    await this.prompt('Which shell is the container using?', [
      'bash',
      'ash',
    ]).then((answer: any) => {
      this.spawn('docker', ['exec', '-ti', id.trim(), answer.choice]);
    });
  }

  private async fuzzySearch(choices: string[], term: string) {
    const searches = new FuzzySearch(choices).search(term);
    if (searches.length === 0) {
      error(
        `Was not able to match with container or image for search: ${term}`
      );
    }
    return searches;
  }

  private async determineChoiceForCommand(
    command: string,
    choices: string[],
    nonFlags: any
  ) {
    let choice;
    const { question, customPassing } = this.commands[command];
    const nonFlagNames = Object.keys(nonFlags);

    if (customPassing && nonFlagNames.length === 1) {
      const term = nonFlagNames[0];
      const choicesAfterFuzzySearching = await this.fuzzySearch(choices, term);

      // Check if the nonFlags passed completely match an id or name
      // We don't want to ask for confirmation in this case
      if (choicesAfterFuzzySearching.length === 1) {
        choice = choicesAfterFuzzySearching[0];
        if (
          term === choice.split('-')[0].trim() ||
          term === choice.split('-')[1].trim()
        ) {
          this.default();
          return;
        }

        // Ask the user for confirmation
        const confirmation = await this.prompt(
          `Are you sure you want to execute '${command}' for container '${choice}'`,
          ['Yes', 'No']
        );

        if (confirmation.choice === 'No') {
          error('Exiting on request of user...');
        }
      } else {
        // Multiple results returned from fuzzy search so ask user for confirmation
        choice = (await this.prompt(
          `Search '${term}' returned more than one result, please make a choice from the list below.`,
          choicesAfterFuzzySearching
        )).choice;
      }
    } else {
      choice = (await this.prompt(question!, choices)).choice;
    }

    return choice;
  }

  private async execute(
    command: string,
    type: string,
    flags: string[] = [],
    nonFlags?: any
  ) {
    const { question, error: commandError } = this.commands[command];

    // Special custom commands without prompt
    if (!question && !error) {
      switch (command) {
        case 'prune':
          this.spawn('docker', ['system', 'prune', '-f']);
          return;
      }
    }

    // Generate the choices for command type
    const choices = this.createChoices(type);
    if (choices.length > 0) {
      // Extract the id from the choice that was made or given
      const choice = await this.determineChoiceForCommand(
        command,
        choices,
        nonFlags
      );
      const id = choice.split('-')[0].trim();

      // Define custom command logic if needed for specific commands
      switch (command) {
        case 'ssh': {
          await this.ssh(id);
          return;
        }
        case 'env':
          this.spawn('docker', ['exec', '-ti', id, 'env']);
          return;
        case 'stop':
          if (flags.includes('-f') || flags.includes('--force')) {
            this.spawn('docker', ['rm', ...flags, id]);
          }
          return;
      }

      // Normal execution of command
      this.spawn('docker', [command, ...flags, id]);
    } else {
      warn(commandError!);
    }
  }
}
