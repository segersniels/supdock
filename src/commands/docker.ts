import { Command, MockingConfig } from './index';
import { traceFunction } from 'helpers/util';

@traceFunction()
export default class Docker extends Command {
  constructor(command: string, config?: MockingConfig) {
    super(command, config);
  }
}
