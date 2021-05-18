import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Prune extends Command {
  constructor() {
    super('prune');
  }

  public async run() {
    // Log additional information
    if (this.flags.includes('--info')) {
      const args = ['system', 'df'];
      return this.spawn('docker', args);
    }

    const args = ['system', 'prune', '-f', ...this.flags];
    return this.spawn('docker', args);
  }
}
