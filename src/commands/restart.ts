import Command from '../command';
import prompts from 'prompts';
import CommandAlias from 'enums/CommandAlias';
import ErrorHandler, { ExecutionError } from 'helpers/errors';
import FuzzyHelper from 'helpers/fuzzy';
import { Trace } from '@aiteq/trace';
import Error from 'enums/Error';

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
      await this.errorHandler.catch(err as ExecutionError, async err => {
        // Not interested in other errors, we're not handling these
        if (err.message !== Error.NoRestartContainers) {
          throw err;
        }

        // Check if the container is stopped and not running
        const stoppedContainers = this.generateChoices(
          CommandAlias.STOPPED_CONTAINERS,
        );

        const found = await FuzzyHelper.search(this, stoppedContainers);

        // Found the desired container under the stopped containers
        if (typeof found !== 'string') {
          throw err;
        }

        const { start } = await prompts(
          {
            type: 'confirm',
            name: 'start',
            message: `The container (${found}) does not seem to be running. Do you want to start it instead?`,
            initial: true,
          },
          {
            onCancel: () => process.exit(),
          },
        );

        if (!start) {
          return;
        }

        // Start the requested container
        return this.spawn('docker', ['start', found.split('-')[0].trim()]);
      });
    }
  }
}
