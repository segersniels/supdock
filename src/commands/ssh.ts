import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Ssh extends Command {
  constructor() {
    super('ssh');
  }

  public async determineShell() {
    return await this.prompt('Which shell is the container using?', [
      'bash',
      'ash',
    ]);
  }

  public async execute() {
    const { choice } = await this.determineShell();
    const args = ['exec', '-ti', this.id.trim(), choice];
    return this.spawn('docker', args);
  }
}
