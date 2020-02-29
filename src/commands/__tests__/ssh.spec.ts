import 'mocha';
import Ssh from 'commands/ssh';
import { expect } from 'chai';

describe('env', () => {
  it('should correctly execute', async () => {
    const command = new Ssh(
      {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        determineChoice: () => '456 - foo',
      },
      {
        determineShell: () => ({
          choice: 'bash',
        }),
      },
    );
    expect(await command.run()).to.eql(`docker exec -ti 456 bash`);
  });
});
