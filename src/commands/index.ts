import { spawnSync, execSync, spawn } from 'child_process';
import { parseArguments } from 'helpers/args';
import flatten from 'lodash.flatten';
import { default as metadata, Metadata } from 'metadata';
import ConfigOptions from 'enums/ConfigOptions';
import { error, traceFunction, info, log } from 'helpers/util';
import FuzzySearch from 'fuzzy-search';
import Config from 'helpers/config';
import {
  generateFlagDescriptions,
  generateCustomCommandDescription,
} from 'helpers/description';
import { version } from 'package';
import { parseOutput } from 'helpers/test';
import prompts from 'prompts';

@traceFunction()
export default class Command {
  private command: string;
  private mocking: boolean;
  public metadata: Metadata;
  public allowedFlags: string[];
  public config: Config = new Config();
  public args: {
    command: any;
    flags: any;
    nonFlags: string[];
  } = parseArguments();
  public id: string;
  public flags: string[];
  public shouldPrompt = true;

  constructor(command: string) {
    // Metadata
    this.command = command;
    this.metadata = metadata[command];

    // Config
    this.config.migrate();

    // Mocking
    this.mocking = process.env.NODE_ENV === 'test';

    // Flags
    this.allowedFlags = flatten(this.metadata?.flags) || [];
    this.flags = this.parseFlags(this.args.flags);
  }

  private parseFlags(flags: any) {
    const parsed: string[] = [];

    for (const flag of Object.keys(flags)) {
      // Minimist parses --no-<flag> variables to a boolean flag with value false with the --no prefix stripped
      // So we have to readd the prefix
      if (!flags[flag]) {
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

  private parallel() {
    info('Asynchronous execution of command is happening in the background');
    info(
      `Some containers might take longer than others to ${this.command}`,
      true,
    );

    const ids: string[] = this.createChoices().map((choice: string) =>
      choice.split('-')[0].trim(),
    );
    ids.forEach(id => {
      const child = spawn('docker', [this.command, id], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });

    return ids;
  }

  private fuzzySearch = async (choices: string[]) => {
    // When fuzzy searching is disabled make sure we passthrough back to docker so we don't hinder docker behaviour
    if (!this.config.get(ConfigOptions.FUZZY_SEARCH)) {
      return this.default();
    }

    let choice: string;
    const term = this.args.nonFlags[0];
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
          !this.metadata.custom
        ) {
          return this.default();
        }

        // Ask the user for confirmation
        if (this.config.get(ConfigOptions.CAUTION_CHECK)) {
          const confirmation = await this.prompt(
            `Are you sure you want to execute '${this.command}' for container '${choice}'`,
            ['Yes', 'No'],
          );

          if (confirmation.choice === 'No') {
            error('Exiting on request of user...');
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
              !this.metadata.custom,
          )
        ) {
          return this.default();
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

  public async determineChoice(choices: string[]) {
    const { question, allowFuzzySearching } = this.metadata;

    // Try to fuzzy match the given search term
    if (allowFuzzySearching && this.args.nonFlags.length === 1) {
      return await this.fuzzySearch(choices);
    }

    // Default behaviour just ask question and prompt for choice
    const { choice } = await this.prompt(question!, choices);
    return choice;
  }

  public createChoices() {
    return execSync(this.metadata.type!, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async inject(): Promise<any> {}

  public version() {
    log(version);
  }

  public usage() {
    const {
      custom,
      usage,
      description,
      options,
      extraUsageInfo,
    } = this.metadata;

    // When command has custom usage defined log that instead of throwing the unknown command to docker
    if (usage) {
      return this.spawn('docker', usage.split(' '));
    }

    // Allow commands to have their own detailed usage information when a complete custom command
    // Overwritten by usage alias above
    if (custom && !usage) {
      info(
        generateCustomCommandDescription(this.command, description, options),
      );
    }

    // When a standard docker command log the default docker usage info first
    if (!usage && !custom) {
      this.default();
    }

    // Only log extra stuff if there are actual custom flags for the command
    const flagDescriptions = generateFlagDescriptions(this.command);
    if (flagDescriptions.length > 0) {
      info(
        `\nOptions supported through prompt (supdock):\n${flagDescriptions}`,
      );
      if (extraUsageInfo) {
        info(`\n${extraUsageInfo}`);
      }
    }

    return;
  }

  public prompt(message: string, choices: string[]) {
    return prompts({
      type: 'select',
      name: 'choice',
      message,
      choices: choices.map(c => ({ title: c, value: c })),
    });
  }

  public spawn(command: string, args: string[]) {
    // Filter out all falsy arguments
    args = args.filter(arg => arg);

    return this.mocking
      ? parseOutput(args)
      : spawnSync(command, args, { stdio: 'inherit' });
  }

  public default(options: string[] = process.argv.slice(2)) {
    return this.spawn(
      'docker',
      this.mocking
        ? [this.command, ...this.flags, ...this.args.nonFlags]
        : options,
    );
  }

  public execute(): any {
    return this.spawn('docker', [this.command, ...this.flags, this.id]);
  }

  public async run() {
    // Default docker command
    if (!this.metadata) {
      return this.default();
    }

    // Usage requested
    if (
      this.args.flags.help ||
      this.args.flags.h ||
      this.flags.includes('--help') ||
      this.flags.includes('-h')
    ) {
      return this.usage();
    }

    // Some commands allow passing 'all' as a valid option. eg. start, stop and restart.
    // These can bypass everything custom and just be fired early
    if (this.args.nonFlags.includes('all') && this.metadata.parallelExecution) {
      return this.parallel();
    }

    // Custom initialisation logic passed
    await this.inject();

    if (this.shouldPrompt) {
      const choices = this.createChoices();
      if (!choices.length) {
        return error(
          this.metadata.error ||
            `unable to generate choices to execute command '${this.command}'`,
        );
      }

      // Extract the id from the choice that was made or given
      const choice = await this.determineChoice(choices);

      // Unable to determine choice or when defaulted to docker
      // When testing we want to test if we defaulted correctly in some cases
      // So in this case just return the defaulted command when testing
      if (
        !choice ||
        typeof choice !== 'string' ||
        (process.env.NODE_ENV === 'test' &&
          choice.startsWith(`docker ${this.command}`))
      ) {
        return choice;
      }

      this.id = choice.split('-')[0].trim();
    }

    return this.execute();
  }
}
