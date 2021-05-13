import ConfigOptions from 'enums/ConfigOptions';
import FuzzySearch from 'fuzzy-search';
import Config from './config';
import { ExecutionError } from './errors';
import prompts from 'prompts';
import { default as metadata } from 'metadata';
import Command from 'command';

export default class Fuzzy {
  public static async search(that: Partial<Command>, choices: string[]) {
    let choice: string;
    const info = metadata[that.command!];
    const config = that.config ?? new Config();
    const term = that.args!.nonFlags[0];
    const choicesAfterFuzzySearching = new FuzzySearch(choices).search(term);

    if (choicesAfterFuzzySearching.length === 0) {
      throw new ExecutionError(
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
          !info.custom // Don't default custom commands
        ) {
          return that.default!();
        }

        // Ask the user for confirmation
        if (config.get(ConfigOptions.CAUTION_CHECK)) {
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
              !info.custom,
          )
        ) {
          return that.default!();
        }

        choice = (
          await prompts({
            type: 'select',
            name: 'choice',
            message: `Search '${term}' returned more than one result, please make a choice from the list below.`,
            choices: choices.map(c => ({ title: c, value: c })),
          })
        ).choice;
    }

    return choice;
  }
}
