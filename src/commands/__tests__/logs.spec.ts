import 'mocha';
import Logs from 'commands/logs';
import Config from 'commands/config';
import { expect } from 'chai';
import ConfigOptions from 'enums/ConfigOptions';
import { deleteConfig } from 'helpers/config';

describe('logs', async () => {
  afterEach(() => {
    deleteConfig();
  });

  const config = new Config('disable', {
    prompt: () => ({ choice: ConfigOptions.SHORT_LOGS }),
  });
  await config.run();

  it('should correctly execute', async () => {
    const command = new Logs({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
    });
    expect(await command.run()).to.eql('docker logs 456');
  });

  it('should correctly execute when passing --follow', async () => {
    const command = new Logs({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
      parseFlags: () => ['--follow'],
    });
    expect(await command.run()).to.eql('docker logs --follow 456');
  });

  it('should append short logs flags', async () => {
    const config = new Config('enable', {
      prompt: () => ({ choice: ConfigOptions.SHORT_LOGS }),
    });
    await config.run();

    const command = new Logs({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
      parseFlags: () => ['--follow'],
    });
    expect(await command.run()).to.eql('docker logs --tail 500 --follow 456');
  });
});
