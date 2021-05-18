import { spawnSync, execSync, spawn } from 'child_process';
import * as ArgsHelper from 'helpers/args';
import flatten from 'lodash.flatten';
import { default as metadata, Metadata } from 'metadata';
import ConfigOptions from 'enums/ConfigOptions';
import * as UtilHelper from 'helpers/util';
import FuzzyHelper from 'helpers/fuzzy';
import Config from 'helpers/config';
import * as DescriptionHelper from 'helpers/description';
import { version } from 'package';
import * as TestHelper from 'helpers/test';
import prompts from 'prompts';
import { ExecutionError } from 'helpers/errors';
import CommandAlias from 'enums/CommandAlias';
import FlagHelper from 'helpers/flag';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Command {
  private mocking = process.env.NODE_ENV === 'test';
  private path: string;

  public command: string;
  public metadata: Metadata;
  public allowedFlags: string[];
  public config = new Config();
  public args: {
    command: any;
    flags: any;
    nonFlags: string[];
  };
  public id: string;
  public flags: string[];
  public shouldPrompt = true;

  constructor(command: string) {
    this.command = command;
    this.metadata = metadata[command];

    // Dynamic determining of docker path
    this.path = this.config.get(ConfigOptions.BINARY_PATH) ?? 'docker';

    // Handle config migrations
    this.config.migrate();

    // Handle flags
    this.args = ArgsHelper.parseArguments();
    this.allowedFlags = flatten(this.metadata?.flags) || [];
    this.flags = FlagHelper.parse(this.args.flags);
  }

  /**
   * Ensure we can match the passed command with metadata
   */
  private ensureValidMetadata() {
    if (this.metadata) {
      return;
    }

    // No metadata found for request command, pass to default docker exection
    this.default();
    process.exit();
  }

  public parallel() {
    UtilHelper.info(
      'Asynchronous execution of command is happening in the background',
    );
    UtilHelper.info(
      `Some containers might take longer than others to ${this.command}`,
      true,
    );

    const ids: string[] = this.createChoices().map((choice: string) =>
      choice.split('-')[0].trim(),
    );

    ids.forEach(id => {
      const child = spawn(this.path, [this.command, id], {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
    });

    return ids;
  }

  public async prompt(
    question: string,
    choices?: string[],
    type = 'select',
    initial?: any,
  ) {
    const { choice } = await prompts({
      type: type as any,
      name: 'choice',
      message: question,
      choices: choices ? choices.map(c => ({ title: c, value: c })) : undefined,
      initial,
    });

    return choice;
  }

  public async determineChoice(choices: string[]) {
    const { question, allowFuzzySearching } = this.metadata;

    // Try to fuzzy match the given search term
    if (allowFuzzySearching && this.args.nonFlags.length >= 1) {
      // When fuzzy searching is disabled make sure we passthrough back to docker so we don't hinder docker behaviour
      if (!this.config.get(ConfigOptions.FUZZY_SEARCH)) {
        return this.default();
      }

      return await FuzzyHelper.search(this, choices);
    }

    const { choice } = await prompts({
      type: 'select',
      name: 'choice',
      message: question!,
      choices: choices.map(c => ({ title: c, value: c })),
    });

    return choice;
  }

  public createChoices(type?: CommandAlias) {
    return execSync(type ?? this.metadata.type!, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(line => line);
  }

  public version() {
    UtilHelper.log(version);
  }

  public usage() {
    this.ensureValidMetadata();

    const {
      custom,
      usage,
      description,
      options,
      extraUsageInfo,
    } = this.metadata;

    // When command has custom usage defined log that instead of throwing the unknown command to docker
    if (usage) {
      return this.spawn(this.path, usage.split(' '));
    }

    // Allow commands to have their own detailed usage information when a complete custom command
    // Overwritten by usage alias above
    if (custom && !usage) {
      UtilHelper.info(
        DescriptionHelper.generateCustomCommandDescription(
          this.command,
          description,
          options,
        ),
      );
    }

    // When a standard docker command log the default docker usage info first
    if (!usage && !custom) {
      this.default();
    }

    // Only log extra stuff if there are actual custom flags for the command
    const flagDescriptions = DescriptionHelper.generateFlagDescriptions(
      this.command,
    );

    if (flagDescriptions.length > 0) {
      UtilHelper.info(
        `\nOptions supported through prompt (supdock):\n${flagDescriptions}`,
      );

      if (extraUsageInfo) {
        UtilHelper.info(`\n${extraUsageInfo}`);
      }
    }

    return;
  }

  public spawn(command: string, args: string[]) {
    // Filter out all falsy arguments
    args = args.filter(arg => arg);

    if (this.mocking) {
      return TestHelper.parseOutput(args);
    }

    return spawnSync(command, args, { stdio: 'inherit' });
  }

  public default(options: string[] = process.argv.slice(2)) {
    const args = this.mocking
      ? [this.command, ...this.flags, ...this.args.nonFlags]
      : options;

    return this.spawn(this.path, args);
  }

  public execute(): any {
    return this.spawn(this.path, [this.command, ...this.flags, this.id]);
  }

  public async run() {
    this.ensureValidMetadata();

    if (this.shouldPrompt) {
      const choices = this.createChoices();

      if (!choices.length) {
        throw new ExecutionError(
          this.metadata.error ||
            `Unable to generate choices to execute command '${this.command}'`,
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
