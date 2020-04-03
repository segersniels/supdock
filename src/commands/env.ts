import { Command } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Env extends Command {
  constructor() {
    super('env');
  }

  public async execute() {
    const args = ['exec', '-ti', this.id, 'env'];
    return this.spawn('docker', args);
  }
}
