import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Env extends Command {
  constructor() {
    super('env');
  }

  public async execute() {
    const args = ['exec', '-ti', this.id, 'env'];
    return this.spawn('docker', args);
  }
}
