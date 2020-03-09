import 'mocha';
import Stats from 'commands/stats';
import { expect } from 'chai';

describe('stats', () => {
  it('should correctly execute', async () => {
    const command = new Stats({});
    expect(await command.run()).to.eql('docker stats');
  });

  it('should correctly execute with --all flag', async () => {
    const command = new Stats({
      parseFlags: () => ['--all'],
    });
    expect(await command.run()).to.eql('docker stats --all');
  });

  it('should correctly prompt when passing --prompt flag', async () => {
    const command = new Stats({
      parseFlags: () => ['--prompt'],
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
    });
    expect(await command.run()).to.eql('docker stats 456');
  });
});
