import 'mocha';
import Config from 'commands/config';
import ConfigOptions from 'enums/ConfigOptions';
import { deleteConfig } from 'helpers/config';
import { mock } from 'helpers/test';
import sinon from 'sinon';

describe('config', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    deleteConfig();
  });

  it('should correctly enable', async () => {
    mock(Config.prototype, sandbox, {
      prompt: { choice: ConfigOptions.CAUTION_CHECK },
    });

    await new Config('enable').run();
  });

  it('should correctly disable', async () => {
    mock(Config.prototype, sandbox, {
      prompt: { choice: ConfigOptions.CAUTION_CHECK },
    });

    await new Config('disable').run();
  });

  it('should correctly log usage of fully custom command', async () => {
    mock(Config.prototype, sandbox, {
      args: {
        flags: {
          help: true,
        },
      },
    });

    await new Config('disable').run();
  });
});
