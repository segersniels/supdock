import 'mocha';
import Prune from 'commands/prune';
import { expect } from 'chai';
import { mock } from 'helpers/test';
import sinon from 'sinon';

describe('prune', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mock(Prune.prototype, sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should correctly execute', async () => {
    expect(await new Prune().run()).to.eql('docker system prune -f');
  });

  it('should correctly return info', async () => {
    mock(Prune.prototype, sandbox, {
      args: {
        flags: {
          info: true,
        },
      },
    });

    expect(await new Prune().run()).to.eql('docker system df');
  });
});
