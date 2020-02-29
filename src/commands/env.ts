import { Command } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Env extends Command {
  constructor() {
    super('env');
  }

  public async execute() {
    this.spawn('docker', ['exec', '-ti', this.id, 'env']);
  }
}
