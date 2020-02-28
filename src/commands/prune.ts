import { Command } from './index';
import { traceFunction } from '../helpers/util';

@traceFunction()
export default class Prune extends Command {
  constructor() {
    super('prune');
  }

  public async run() {
    // Log additional information
    if (this.flags.includes('--info')) {
      this.spawn('docker', ['system', 'df']);
      // Remove the info flag for further execution
      this.flags = this.flags.filter(flag => flag !== '--info');
    }

    this.spawn('docker', ['system', 'prune', '-f', ...this.flags]);
  }
}
