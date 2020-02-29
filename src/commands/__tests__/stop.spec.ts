import 'mocha';
import Stop from 'commands/stop';
import { expect } from 'chai';

describe('stop', () => {
  it('should correctly execute', async () => {
    const command = new Stop({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
    });
    expect(await command.run()).to.eql('docker stop 456');
  });

  it('should correctly execute with --force flag', async () => {
    const command = new Stop({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
      parseFlags: () => ['--force'],
    });
    expect(await command.run()).to.eql('docker rm --force 456');
  });
});
