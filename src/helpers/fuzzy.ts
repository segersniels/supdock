import ConfigOptions from 'enums/ConfigOptions';
import { fuzzy } from 'webassembly/supdock';
import Config from './config';
import { ExecutionError } from './errors';
import prompts from 'prompts';
import { default as metadata } from 'metadata';
import Command from 'command';
import { Trace } from '@aiteq/trace';
import * as UtilHelper from './util';

export default class Fuzzy {
  @Trace()
  public static async search(that: Partial<Command>, choices: string[]) {
    const info = metadata[that.command!];
    const config = that.config ?? new Config();
    const term = that.args!.nonFlags[0];
    const choicesAfterFuzzySearching = fuzzy(choices, term);

    switch (choicesAfterFuzzySearching.length) {
      case 0: {
        throw new ExecutionError(
          `Was not able to match with container or image for search: ${term}`,
        );
      }
      // Identical match found based on id or name
      case 1: {
        const choice = choicesAfterFuzzySearching[0];

        if (
          (term === choice.split('-')[0].trim() ||
            term === choice.split('-')[1].trim() ||
            choice
              .split('-')[0]
              .trim()
              .startsWith(term)) &&
          !info.custom // Don't default custom commands
        ) {
          return that.default!();
        }

        // Ask the user for confirmation
        if (config.get(ConfigOptions.CAUTION_CHECK)) {
          UtilHelper.info(
            `You can disable this check by running 'supdock disable caution-check'`,
            true,
          );

          const confirmation = await prompts({
            type: 'confirm',
            name: 'choice',
            message: `Are you sure you want to execute '${that.command}' for container '${choice}'`,
            initial: true,
          });

          if (!confirmation.choice) {
            throw new ExecutionError('Exiting on request of user...');
          }
        }

        return choice;
      }
    }

    for (const choice of choicesAfterFuzzySearching) {
      const [id, name] = choice.split('-', 2);

      // Check if remaining options have an identical match on container id
      if ((term === id.trim() || id.trim().startsWith(term)) && !info.custom) {
        return that.default!();
      }

      // Check for identical match on name
      if (term === name.trim()) {
        return that.default!();
      }
    }

    const { choice } = await prompts({
      type: 'select',
      name: 'choice',
      message: `Search '${term}' returned more than one result, please make a choice from the list below.`,
      choices: choices.map(c => ({ title: c, value: c })),
    });

    return choice;
  }
}
