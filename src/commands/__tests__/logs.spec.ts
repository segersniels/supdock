import 'mocha';
import Logs from 'commands/logs';
import { expect } from 'chai';

describe('logs', () => {
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
});
