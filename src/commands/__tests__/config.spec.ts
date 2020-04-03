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

    const command = new Config('enable');
    await command.run();
  });

  it('should correctly disable', async () => {
    mock(Config.prototype, sandbox, {
      prompt: { choice: ConfigOptions.CAUTION_CHECK },
    });

    const command = new Config('disable');
    await command.run();
  });

  it('should correctly log usage of fully custom command', async () => {
    mock(Config.prototype, sandbox, {
      args: {
        flags: {
          help: true,
        },
      },
    });

    const command = new Config('disable');
    await command.run();
  });
});
