import Command from '../command';
import { info } from 'helpers/util';
import { ExecutionError } from 'helpers/errors';
import { Trace } from '@aiteq/trace';

@Trace()
export default class Config extends Command {
  private type: string;

  constructor(type: string) {
    super(type);
    this.type = type;
  }

  public async run() {
    // Usage requested
    if (
      this.args.flags.help ||
      this.args.flags.h ||
      this.flags.includes('--help') ||
      this.flags.includes('-h')
    ) {
      return this.usage();
    }

    if (!this.args.nonFlags.length) {
      const { inactive, active } = this.config;

      if (
        (this.type === 'enable' && !inactive.length) ||
        (this.type === 'disable' && !active.length)
      ) {
        throw new ExecutionError(`No options found to ${this.type}`);
      }

      const { choice } = await this.prompt(
        `Which config value would you like to ${this.type}?`,
        this.type === 'enable' ? this.config.inactive : this.config.active,
      );

      if (!choice) {
        return;
      }

      this.args.nonFlags = [choice];
    }

    for (const key of this.args.nonFlags) {
      this.config.set(key, this.type === 'enable');
      info(
        `Config '${key}' ${this.type === 'enable' ? 'enabled' : 'disabled'}`,
      );
    }

    return;
  }
}
