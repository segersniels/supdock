import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

interface ExtendedConfig {
  determineShell: Function;
}

@traceFunction()
export default class Ssh extends Command {
  private extended: ExtendedConfig;

  constructor(config?: MockingConfig, extended?: ExtendedConfig) {
    super('ssh', config);
    if (this.mocking) {
      this.extended = {
        determineShell:
          extended?.determineShell || this.determineShell.bind(this),
      };
    }
  }

  private async determineShell() {
    return await this.prompt('Which shell is the container using?', [
      'bash',
      'ash',
    ]);
  }

  public async execute() {
    const { choice } = await this.extended.determineShell();
    const args = ['exec', '-ti', this.id.trim(), choice];
    return this.spawn('docker', args);
  }
}
