import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Stats extends Command {
  constructor() {
    super('stats');
    this.shouldPrompt = false;
  }

  public async run() {
    if (this.flags.includes('--all')) {
      return this.spawn('docker', ['stats', '--all']);
    }

    if (
      this.allowedFlags.includes('prompt') &&
      (this.flags.includes('-p') || this.flags.includes('--prompt'))
    ) {
      this.shouldPrompt = true;
      // Filter out the prompt flag for further execution
      this.flags = this.flags.filter(
        flag => !['--prompt', '-p'].includes(flag),
      );
    }

    return super.run();
  }
}
