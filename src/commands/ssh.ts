import { Command } from './index';
import { traceFunction } from '../helpers/util';

@traceFunction()
export default class Ssh extends Command {
  constructor() {
    super('ssh');
  }

  public async execute() {
    await this.prompt('Which shell is the container using?', [
      'bash',
      'ash',
    ]).then((answer: any) => {
      this.spawn('docker', ['exec', '-ti', this.id.trim(), answer.choice]);
    });
  }
}
