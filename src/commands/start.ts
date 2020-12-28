import Command from '../command';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Start extends Command {
  constructor() {
    super('start');
  }

  public async run() {
    if (this.args.nonFlags.includes('all') && this.metadata.parallelExecution) {
      return this.parallel();
    }

    return await super.run();
  }
}
