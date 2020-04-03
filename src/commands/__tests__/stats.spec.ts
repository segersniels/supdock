import 'mocha';
import Stats from 'commands/stats';
import { expect } from 'chai';
import sinon from 'sinon';
import { mock } from 'helpers/test';

describe('stats', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mock(Stats.prototype, sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should correctly execute', async () => {
    expect(await new Stats().run()).to.eql('docker stats');
  });

  it('should correctly execute with --all flag', async () => {
    mock(Stats.prototype, sandbox, {
      args: {
        flags: {
          all: true,
        },
      },
    });

    expect(await new Stats().run()).to.eql('docker stats --all');
  });

  it('should correctly prompt when passing --prompt flag', async () => {
    mock(Stats.prototype, sandbox, {
      args: {
        flags: {
          prompt: true,
        },
      },
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
    });

    expect(await new Stats().run()).to.eql('docker stats 456');
  });
});
