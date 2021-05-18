import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
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
