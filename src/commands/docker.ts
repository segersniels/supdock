import Command from '../command';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Docker extends Command {
  constructor(command: string) {
    super(command);
  }
}
