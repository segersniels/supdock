import 'mocha';
import Logs from 'commands/logs';
import Config from 'commands/config';
import { expect } from 'chai';
import ConfigOptions from 'enums/ConfigOptions';
import { deleteConfig } from 'helpers/config';
import sinon from 'sinon';
import { mock } from 'helpers/test';

describe('logs', async () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    deleteConfig();
  });

  it('should correctly execute', async () => {
    mock(Logs.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
    });

    expect(await new Logs().run()).to.eql('docker logs 456');
  });

  it('should correctly execute when passing --follow', async () => {
    mock(Logs.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
      args: {
        flags: {
          follow: true,
        },
      },
    });

    expect(await new Logs().run()).to.eql('docker logs --follow 456');
  });

  it('should append short logs flags', async () => {
    mock(Config.prototype, sandbox, {
      prompt: { choice: ConfigOptions.SHORT_LOGS },
    });

    await new Config('enable').run();

    mock(Logs.prototype, sandbox, {
      createChoices: ['123 - abc', '456 - foo', '789 - bar'],
      determineChoice: '456 - foo',
      args: {
        flags: {
          follow: true,
        },
      },
    });

    expect(await new Logs().run()).to.eql(
      'docker logs --tail 500 --follow 456',
    );
  });
});
