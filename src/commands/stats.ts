import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Stats extends Command {
  constructor(config?: MockingConfig) {
    super('stats', config);
  }

  public async run() {
    await this.check();

    if (this.flags.includes('--all')) {
      return this.spawn('docker', ['stats', '--all']);
    }

    if (
      this.allowedFlags.includes('prompt') &&
      (this.flags.includes('-p') || this.flags.includes('--prompt'))
    ) {
      await this.determine();
      // Filter out the prompt flag for further execution
      this.flags = this.flags.filter(
        flag => !['--prompt', '-p'].includes(flag),
      );
    }

    return this.execute();
  }
}
