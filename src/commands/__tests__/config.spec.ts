import 'mocha';
import Config from 'commands/config';
import ConfigOptions from 'enums/ConfigOptions';

describe('config', () => {
  it('should correctly enable', async () => {
    const command = new Config('enable', {
      prompt: () => ({ choice: ConfigOptions.CAUTION_CHECK }),
    });
    await command.run();
  });

  it('should correctly disable', async () => {
    const command = new Config('disable', {
      prompt: () => ({ choice: ConfigOptions.CAUTION_CHECK }),
    });
    await command.run();
  });

  it('should correctly log usage of fully custom command', async () => {
    process.argv.push('--help');
    const command = new Config('disable', {
      parseFlags: () => ['--help'],
    });
    await command.run();
  });
});
