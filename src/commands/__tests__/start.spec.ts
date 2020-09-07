import 'mocha';
import Start from 'commands/stop';
import { expect } from 'chai';
import sinon from 'sinon';
import { mock } from 'helpers/test';

describe('stop', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should correctly execute parallel prompt command', async () => {
    mock(Start.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      args: {
        nonFlags: ['all'],
      },
    });

    expect(await new Start().run()).to.eql(['123', '456', '789']);
  });
});
