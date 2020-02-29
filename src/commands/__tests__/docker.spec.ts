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
});
