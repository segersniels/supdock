import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Env extends Command {
  constructor(config?: MockingConfig) {
    super('env', config);
  }

  public async execute() {
    const args = ['exec', '-ti', this.id, 'env'];
    return this.spawn('docker', args);
  }
}
