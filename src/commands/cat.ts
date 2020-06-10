import Command from 'commands';
import { traceFunction } from 'helpers/util';
import prompts from 'prompts';

@traceFunction()
export default class Cat extends Command {
  constructor() {
    super('cat');
  }

  private async determineFile() {
    return await prompts({
      type: 'text',
      name: 'choice',
      message: 'Which file would you like to cat?',
    });
  }

  public async run() {
    let file;
    const choices = this.createChoices();
    const choice = await this.determineChoice(choices);
    this.id = choice.split('-')[0].trim();

    if (this.args.nonFlags.length > 1) {
      // Remove the first element since this is used for fuzzy searching
      this.args.nonFlags.shift();
      file = this.args.nonFlags.join('');
    } else {
      const { choice } = await this.determineFile();
      file = choice;
    }

    return this.spawn('docker', ['exec', '-ti', this.id.trim(), 'cat', file]);
  }
}
