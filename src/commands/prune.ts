import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Prune extends Command {
  constructor(config?: MockingConfig) {
    super('prune', config);
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
