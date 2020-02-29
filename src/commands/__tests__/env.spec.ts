import 'mocha';
import Env from 'commands/env';
import { expect } from 'chai';

describe('env', () => {
  it('should correctly execute', async () => {
    const command = new Env({
      createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: () => '456 - foo',
    });
    expect(await command.run()).to.eql('docker exec -ti 456 env');
  });
});
