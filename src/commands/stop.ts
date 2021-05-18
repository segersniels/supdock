import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Stop extends Command {
  constructor() {
    super('stop');
  }

  public async execute() {
    if (this.flags.includes('-f') || this.flags.includes('--force')) {
      return this.spawn('docker', ['rm', ...this.flags, this.id]);
    }

    return this.spawn('docker', ['stop', ...this.flags, this.id]);
  }

  public async run() {
    if (this.args.nonFlags.includes('all') && this.metadata.parallelExecution) {
      return this.parallel();
    }

    return await super.run();
  }
}
