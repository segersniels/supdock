import { Command } from './index';
import { traceFunction } from '../helpers/util';

@traceFunction()
export default class Stop extends Command {
  constructor() {
    super('stop');
  }

  public async execute() {
    if (this.flags.includes('-f') || this.flags.includes('--force')) {
      this.spawn('docker', ['rm', ...this.flags, this.id]);
      return;
    }

    this.spawn('docker', ['stop', ...this.flags, this.id]);
  }
}
