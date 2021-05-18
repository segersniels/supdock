import Command from '../command';
import { error } from 'helpers/util';
import prompts from 'prompts';
import CommandAlias from 'enums/CommandAlias';
import { SpawnSyncReturns } from 'child_process';
import ErrorHandler from 'helpers/errors';
import FuzzyHelper from 'helpers/fuzzy';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Restart extends Command {
  private errorHandler = new ErrorHandler();

  constructor() {
    super('restart');
  }

  public async run() {
    try {
      if (
        this.args.nonFlags.includes('all') &&
        this.metadata.parallelExecution
      ) {
        return this.parallel();
      }

      return await super.run();
    } catch (err) {
      this.errorHandler.catch(err, async err => {
        if (err.message.includes('Was not able to match with container')) {
          // Check if the container is stopped and not running
          const stoppedContainers = this.createChoices(
            CommandAlias.STOPPED_CONTAINERS,
          );

          let found: string | SpawnSyncReturns<Buffer> | undefined = undefined;
          try {
            found = await FuzzyHelper.search(this, stoppedContainers);
          } catch (err) {
            // Not found under stopped container (will throw the same error as the original one)
            return error(err.message);
          }

          // Found the desired container under the stopped containers
          if (typeof found === 'string') {
            const { start } = await prompts({
              type: 'confirm',
              name: 'start',
              message: `The container (${found}) does not seem to be running. Do you want to start it instead?`,
              initial: true,
            });

            if (!start) {
              return;
            }

            // Start the requested container
            return this.spawn('docker', ['start', found.split('-')[0].trim()]);
          }

          return error(err.message);
        } else {
          // Not the type of ExecutionError that we want to target for this use case
          return error(err.message);
        }
      });
    }
  }
}
