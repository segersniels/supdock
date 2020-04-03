import 'mocha';
import Ssh from 'commands/ssh';
import { expect } from 'chai';
import sinon from 'sinon';
import { mock } from 'helpers/test';

describe('env', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should correctly execute', async () => {
    mock(Ssh.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
      determineShell: { choice: 'bash' },
    });

    expect(await new Ssh().run()).to.eql(`docker exec -ti 456 bash`);
  });
});
