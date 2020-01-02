import { execSync, spawn, spawnSync } from 'child_process';
import * as inquirer from 'inquirer';
import { version } from '../package.json';
import { info, warn, error, log, traceFunction, exit } from './helpers/util';
import metadata from './metadata';
import Command from './interfaces/Command';
import Commands from './types/Commands';
import {
  generateFlagDescriptions,
  generateGeneralDescription,
  generateCustomCommandDescription,
} from './helpers/description';
import FuzzySearch from 'fuzzy-search';
import Config from './helpers/config';
import flatten from 'lodash.flatten';
import ConfigOptions from './enums/ConfigOptions';

@traceFunction()
export default class Supdock {
  private commands: Commands;
  private config: Config;
  private allowedFlags: string[];
  private nonFlags: string[];
  private custom: boolean;
  private command: string;
  private type: string;

  constructor() {
    this.commands = metadata;
    this.config = new Config();
    this.config.migrate();
  }

  public async run(args: any) {
    const {
      type,
      flags,
      custom,
      parallelExecution,
      allowFuzzySearching,
    } = this.commands[args.command];

    // Make these variables globally accessible
    this.custom = !!custom;
    this.nonFlags = args.nonFlags;
    this.allowedFlags = flatten(flags);
    this.type = type!;

    // Some commands allow passing 'all' as a valid option. eg. start, stop and restart.
    // These can bypass everything custom and just be fired early
    if (args.nonFlags.includes('all') && parallelExecution) {
      this.executeInParallel(args.command);
      return;
    }

    // Check if command should default to default docker
    this.checkIfShouldDefault(args, !!allowFuzzySearching);

    // Custom command at this point so continue with normal execution of command
    await this.execute(args.command, this.parseFlags(args.flags));
  }

  public default(options: string[] = process.argv.slice(2)) {
    this.spawn('docker', options);
  }

  public usage(command?: string) {
    if (!command) {
      const commandNames = Object.keys(this.commands);
      log(generateGeneralDescription(this.commands, commandNames));
    } else {
      this.commandUsage(command);
    }
  }

  public version() {
    log(version);
  }

  public getCustomCommands() {
    return Object.keys(this.commands);
  }

  private checkIfShouldDefault(args: any, allowFuzzySearching: boolean) {
    const promptEnabled =
      Object.keys(args.nonFlags).length === 0 ||
      args.flags.p ||
      args.flags.prompt;
    const passedFlags = Object.keys(args.flags);

    // When flag passed is not a valid custom flag
    // or other arguments are being passed default to normal docker
    // or allowed custom passing like fuzzy-searching or passing nonFlag arguments
    if (
      !this.custom &&
      ((passedFlags.length > 0 &&
        !passedFlags.find(flag => this.allowedFlags.includes(flag))) ||
        (!promptEnabled && !allowFuzzySearching))
    ) {
      this.default();
      exit();
    }
  }

  private async executeNoPromptCommands(command: string) {
    switch (command) {
      case 'prune':
        this.spawn('docker', ['system', 'prune', '-f']);
        break;
      case 'enable':
      case 'disable': {
        if (!this.nonFlags.length) {
          const { inactive, active } = this.config;
          if (
            (command === 'enable' && !inactive.length) ||
            (command === 'disable' && !active.length)
          ) {
            error(`No options found to ${command}`);
          }
          const { choice } = await this.prompt(
            `Which config value would you like to ${command}?`,
            command === 'enable' ? this.config.inactive : this.config.active,
          );
          this.nonFlags = [choice];
        }

        for (const key of this.nonFlags) {
          await this.config.set(key, command === 'enable');
          info(
            `Config '${key}' ${command === 'enable' ? 'enabled' : 'disabled'}`,
          );
        }

        break;
      }
    }

    exit();
  }

  private async execute(command: string, flags: string[] = []) {
    const { question, error: commandError } = this.commands[command];

    // Commands without prompt
    if (!question && !commandError) {
      await this.executeNoPromptCommands(command);
    }

    // Generate the choices for command type
    const choices = this.createChoices(this.type);
    if (choices.length > 0) {
      // Extract the id from the choice that was made or given
      const choice = await this.determineChoiceForCommand(command, choices);

      // Unable to determine choice
      if (!choice) {
        return;
      }

      // Normal command execution
      const id = choice.split('-')[0].trim();
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
            return;
          }
          break;
        case 'logs':
          if (this.config.get(ConfigOptions.SHORT_LOGS)) {
            this.spawn('docker', [command, '--tail', '500', ...flags, id]);
            return;
          }
          break;
      }

      this.spawn('docker', [command, ...flags, id]);
    } else {
      warn(commandError!);
    }
  }

  private commandUsage(command: string) {
    // When no supdock command default command to docker
    if (!this.commands[command]) {
      this.default();
      exit();
    }

    const { custom, usage, description, options } = this.commands[command];

    // When command has custom usage defined log that instead of throwing the unknown command to docker
    if (usage) {
      this.spawn('docker', usage.split(' '));
      return;
    }

    // Allow commands to have their own detailed usage information when a complete custom command
    // Overwritten by usage alias above
    if (custom) {
      info(generateCustomCommandDescription(command, description, options));
    }

    // When a standard docker command log the default docker usage info first
    if (!usage && !custom) {
      this.default();
    }

    // Only log extra stuff if there are actual custom flags for the command
    const flagDescriptions = generateFlagDescriptions(this.commands, command);
    if (flagDescriptions.length > 0) {
      const metadata: Command = this.commands[command];
      info(`\nOptions (supdock):\n${flagDescriptions}`);
      if (metadata.extraUsageInfo) {
        info(`\n${metadata.extraUsageInfo}`);
      }
    }
  }

  private executeInParallel(command: string) {
    info('Asynchronous execution of command is happening in the background');
    info(`Some containers might take longer than others to ${command}`, true);

    const ids = this.createChoices(this.type).map(choice =>
      choice.split('-')[0].trim(),
    );
    ids.forEach(id => {
      const child = spawn('docker', [command, id], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });
  }

  private parseFlags(flags: any) {
    const parsed: any[] = [];

    for (const flag of Object.keys(flags)) {
      // If prompt flag has been passed and is allowed for the command strip it from the further execution flags
      if (['p', 'prompt'].includes(flag) && this.allowedFlags.includes(flag)) {
        continue;
      }

      // Minimist parses --no-<flag> variables to a boolean flag with value false with the --no prefix stripped
      // So we have to readd the prefix
      if (this.allowedFlags.includes(`no-${flag}`) && !flags[flag]) {
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

  private fuzzySearch = async (choices: string[]) => {
    // When fuzzy searching is disabled make sure we passthrough back to docker so we don't hinder docker behaviour
    if (!this.config.get(ConfigOptions.FUZZY_SEARCH)) {
      this.default();
      exit();
    }

    let choice: string;
    const term = this.nonFlags[0];
    const choicesAfterFuzzySearching = new FuzzySearch(choices).search(term);
    if (choicesAfterFuzzySearching.length === 0) {
      error(
        `Was not able to match with container or image for search: ${term}`,
      );
    }

    switch (choicesAfterFuzzySearching.length) {
      case 1:
        // Check if the nonFlags passed completely match an id or name
        // We don't want to ask for confirmation in this case
        choice = choicesAfterFuzzySearching[0];
        if (
          (term === choice.split('-')[0].trim() ||
            term === choice.split('-')[1].trim() ||
            choice
              .split('-')[0]
              .trim()
              .startsWith(term)) &&
          !this.custom
        ) {
          this.default();
          exit();
        }

        // Ask the user for confirmation
        if (this.config.get(ConfigOptions.CAUTION_CHECK)) {
          const confirmation = await this.prompt(
            `Are you sure you want to execute '${this.command}' for container '${choice}'`,
            ['Yes', 'No'],
          );

          if (confirmation.choice === 'No') {
            error('Exiting on request of user...');
            exit();
          }
        }
        break;
      default:
        // Check if one of the choices match the search term
        if (
          choicesAfterFuzzySearching.find(
            choice =>
              (term === choice.split('-')[0].trim() ||
                term === choice.split('-')[1].trim() ||
                choice
                  .split('-')[0]
                  .trim()
                  .startsWith(term)) &&
              !this.custom,
          )
        ) {
          this.default();
          exit();
        }

        choice = (
          await this.prompt(
            `Search '${term}' returned more than one result, please make a choice from the list below.`,
            choicesAfterFuzzySearching,
          )
        ).choice;
    }

    return choice;
  };

  private async determineChoiceForCommand(
    command: string,
    choices: string[],
  ): Promise<string | undefined> {
    const { question, allowFuzzySearching } = this.commands[command];

    // Try to fuzzy match the given search term
    if (allowFuzzySearching && this.nonFlags.length === 1) {
      const choice = await this.fuzzySearch(choices);
      return choice;
    }

    // Default behaviour just ask question and prompt for choice
    const { choice } = await this.prompt(question!, choices);
    return choice;
  }
}
