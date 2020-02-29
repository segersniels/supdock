import { Command } from './index';
import { traceFunction } from 'helpers/util';
import ConfigOptions from 'enums/ConfigOptions';

@traceFunction()
export default class Logs extends Command {
  constructor() {
    super('logs');
  }

  public async execute() {
    if (this.config.get(ConfigOptions.SHORT_LOGS)) {
      this.spawn('docker', ['logs', '--tail', '500', ...this.flags, this.id]);
      return;
    }

    this.spawn('docker', ['logs', ...this.flags, this.id]);
  }
}
