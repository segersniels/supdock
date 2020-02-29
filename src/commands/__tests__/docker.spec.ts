import 'mocha';
import Docker from 'commands/docker';
import { expect } from 'chai';

describe('docker', () => {
  it('should correctly passthrough to docker', async () => {
    const command = new Docker('ps', {});
    expect(await command.run()).to.eql('docker ps');
  });

  it('should correctly log usage', async () => {
    const command = new Docker('ps', {
      parseFlags: () => ['--help'],
    });
    expect(await command.run()).to.eql('docker ps --help');
  });

  it('should correctly log usage of supdock command', async () => {
    const command = new Docker('start', {
      parseFlags: () => ['--help'],
    });
    await command.run();
  });

  it('should correctly execute supdock prompt command', async () => {
    const command = new Docker('start', {
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
    });
    expect(await command.run()).to.eql('docker start 456');
  });

  it('should correctly execute parallel prompt command', async () => {
    const command = new Docker('start', {
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      nonFlags: ['all'],
    });
    expect(await command.run()).to.eql(['123', '456', '789']);
  });
});
