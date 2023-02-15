import Command from '../command';
import { Trace } from '@aiteq/trace';
import prompts from 'prompts';

@Trace()
export default class Cat extends Command {
  constructor() {
    super('cat');
  }

  private async determineFile() {
    let file: string;

    do {
      const response = await prompts(
        {
          type: 'text',
          name: 'choice',
          message: 'Which file would you like to cat?',
        },
        {
          onCancel: () => process.exit(),
        },
      );

      file = response.choice;
    } while (!file);

    return file;
  }

  public async run() {
    let file;
    const choices = this.generateChoices();
    const choice = await this.ask(choices);
    if (!choice) {
      return;
    }

    this.id = choice.split('-')[0].trim();

    if (this.args.nonFlags.length > 1) {
      // Remove the first element since this is used for fuzzy searching
      this.args.nonFlags.shift();
      file = this.args.nonFlags.join('');
    } else {
      file = await this.determineFile();
    }

    return this.spawn('docker', ['exec', '-ti', this.id.trim(), 'cat', file]);
  }
}
