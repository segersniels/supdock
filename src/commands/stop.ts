import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Stop extends Command {
  constructor(config?: MockingConfig) {
    super('stop', config);
  }

  public async execute() {
    if (this.flags.includes('-f') || this.flags.includes('--force')) {
      return this.spawn('docker', ['rm', ...this.flags, this.id]);
    }

    return this.spawn('docker', ['stop', ...this.flags, this.id]);
  }
}
