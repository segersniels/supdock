import 'mocha';
import Stop from 'commands/stop';
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

  it('should correctly execute', async () => {
    mock(Stop.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
    });

    const command = new Stop();
    expect(await command.run()).to.eql('docker stop 456');
  });

  it('should correctly execute with --force flag', async () => {
    mock(Stop.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
      args: {
        flags: {
          force: true,
        },
      },
    });

    const command = new Stop();
    expect(await command.run()).to.eql('docker rm --force 456');
  });
});
