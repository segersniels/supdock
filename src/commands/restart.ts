import Command from 'commands';
import { traceFunction, error } from 'helpers/util';
import prompts from 'prompts';
import CommandAlias from 'enums/CommandAlias';
import { SpawnSyncReturns } from 'child_process';
import ErrorHandler from 'helpers/errors';

@traceFunction()
export default class Restart extends Command {
  private errorHandler = new ErrorHandler();

  constructor() {
    super('restart', {
      catchExecutionErrors: false, // Disable the default error catching so we can handle it ourselves
    });
  }

  public async run() {
    try {
      await super.run();
    } catch (err) {
      this.errorHandler.catch(err, async err => {
        if (err.message.includes('Was not able to match with container')) {
          // Check if the container is stopped and not running
          const stoppedContainers = this.createChoices(
            CommandAlias.STOPPED_CONTAINERS,
          );

          let found: string | SpawnSyncReturns<Buffer> | undefined = undefined;
          try {
            found = await this.fuzzySearch(stoppedContainers);
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