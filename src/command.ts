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
import prompts from 'prompts';
import { ExecutionError } from 'helpers/errors';
import CommandAlias from 'enums/CommandAlias';
import FlagHelper from 'helpers/flag';
import { Trace } from '@aiteq/trace';
import Error from 'enums/Error';

@Trace()
export default class Command {
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

  protected parallel() {
    UtilHelper.info(
      'Asynchronous execution of command is happening in the background',
    );
    UtilHelper.info(
      `Some containers might take longer than others to ${this.command}`,
      true,
    );

    const ids: string[] = this.generateChoices().map((choice: string) =>
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

  protected async prompt(
    question: string,
    choices?: string[],
    type = 'select',
    initial?: any,
  ) {
    const { choice } = await prompts(
      {
        type: type as any,
        name: 'choice',
        message: question,
        choices: choices
          ? choices.map(c => ({ title: c, value: c }))
          : undefined,
        initial,
      },
      {
        onCancel: () => process.exit(),
      },
    );

    return choice;
  }

  protected async ask(choices: string[]) {
    const { question, allowFuzzySearching } = this.metadata;

    // Try to fuzzy match the given search term
    if (allowFuzzySearching && this.args.nonFlags.length >= 1) {
      // When fuzzy searching is disabled make sure we passthrough back to docker so we don't hinder docker behavior
      if (!this.config.get(ConfigOptions.FUZZY_SEARCH)) {
        return this.default();
      }

      return await FuzzyHelper.search(this, choices);
    }

    return await this.prompt(question!, choices);
  }

  protected generateChoices(type?: CommandAlias) {
    return execSync(type ?? this.metadata.type!, { maxBuffer: 1024 * 10000 })
      .toString()
      .split('\n')
      .filter(Boolean);
  }

  public version() {
    UtilHelper.log(version);
  }

  public usage() {
    // Handle as default docker command if no metadata is specified, don't bother doing anything
    if (!this.metadata) {
      return this.default();
    }

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
    } else if (custom) {
      // Allow commands to have their own detailed usage information when a complete custom command
      UtilHelper.info(
        DescriptionHelper.generateCustomCommandDescription(
          this.command,
          description,
          options,
        ),
      );
    }

    // Fetch descriptions for potential specified flags
    const flagDescriptions = DescriptionHelper.generateFlagDescriptions(
      this.command,
    );

    // Log the default docker usage info first
    this.default();

    // Log the extended flag descriptions
    if (flagDescriptions.length > 0) {
      UtilHelper.info(
        `\nOptions supported through prompt (supdock):\n${flagDescriptions}`,
      );
    }

    // Some commands will have extra information specified, log it
    if (extraUsageInfo) {
      UtilHelper.info(`\n${extraUsageInfo}`);
    }

    return;
  }

  protected spawn(command: string, args: string[]) {
    // Filter out all falsy arguments
    args = args.filter(Boolean);

    return spawnSync(command, args, { stdio: 'inherit' });
  }

  public default(options: string[] = process.argv.slice(2)) {
    return this.spawn(this.path, options);
  }

  protected execute(): any {
    return this.spawn(this.path, [this.command, ...this.flags, this.id]);
  }

  public async run() {
    // Handle as default docker command if no metadata is specified, don't bother doing anything
    if (!this.metadata) {
      return this.default();
    }

    if (this.shouldPrompt) {
      const choices = this.generateChoices();

      if (!choices.length) {
        throw new ExecutionError(this.metadata.error || Error.InvalidChoices);
      }

      const choice = await this.ask(choices);

      if (!choice || typeof choice !== 'string') {
        return choice;
      }

      // Extract the id from the choice that was made or given
      this.id = choice.split('-')[0].trim();
    }

    return this.execute();
  }
}
