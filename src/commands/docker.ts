import Command from 'commands';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Docker extends Command {
  constructor(command: string) {
    super(command);
  }
}
