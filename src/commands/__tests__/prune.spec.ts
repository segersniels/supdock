import 'mocha';
import Prune from 'commands/prune';
import { expect } from 'chai';

describe('prune', () => {
  it('should correctly execute', async () => {
    const command = new Prune({});
    expect(await command.run()).to.eql('docker system prune -f');
  });

  it('should correctly return info', async () => {
    const command = new Prune({
      parseFlags: () => ['--info'],
    });
    expect(await command.run()).to.eql('docker system df');
  });
});
