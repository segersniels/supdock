import 'mocha';
import Env from 'commands/env';
import { expect } from 'chai';
import { mock } from 'helpers/test';
import sinon from 'sinon';

describe('env', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should correctly execute', async () => {
    mock(Env.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
    });

    expect(await new Env().run()).to.eql('docker exec -ti 456 env');
  });
});
