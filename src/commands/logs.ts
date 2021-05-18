import Command from '../command';
import { Trace } from '@aiteq/trace';
import ConfigOptions from 'enums/ConfigOptions';

@Trace()
export default class Logs extends Command {
  constructor() {
    super('logs');
  }

  public async execute() {
    if (this.config.get(ConfigOptions.SHORT_LOGS)) {
      const args = ['logs', '--tail', '500', ...this.flags, this.id];
      return this.spawn('docker', args);
    }

    const args = ['logs', ...this.flags, this.id];
    return this.spawn('docker', args);
  }
}
