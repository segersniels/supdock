import 'mocha';
import Docker from 'commands/docker';
import { expect } from 'chai';
import ConfigOptions from 'enums/ConfigOptions';
import Config from 'commands/config';
import { deleteConfig } from 'helpers/config';
import { mock } from 'helpers/test';
import sinon from 'sinon';

describe('docker', () => {
  let sandbox: sinon.SinonSandbox;

  describe('fuzzy disabled (default config)', async () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();

      mock(Config.prototype, sandbox, {
        prompt: { choice: ConfigOptions.FUZZY_SEARCH },
      });
      const command = new Config('disable');
      await command.run();

      mock(Docker.prototype, sandbox);
    });

    afterEach(() => {
      sandbox.restore();
      deleteConfig();
    });

    it('should correctly passthrough to docker', async () => {
      const command = new Docker('ps');
      expect(await command.run()).to.eql('docker ps');
    });

    it('should correctly log usage', async () => {
      mock(Docker.prototype, sandbox, {
        args: {
          flags: {
            help: true,
          },
        },
      });

      const command = new Docker('ps');
      expect(await command.run()).to.eql('docker ps --help');
    });

    it('should correctly log usage of supdock command', async () => {
      mock(Docker.prototype, sandbox, {
        args: {
          flags: {
            help: true,
          },
        },
      });

      const command = new Docker('start');
      await command.run();
    });

    it('should correctly execute supdock prompt command', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        determineChoice: '456 - foo',
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql('docker start 456');
    });

    it('should correctly execute parallel prompt command', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['all'],
        },
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql(['123', '456', '789']);
    });

    it('should correctly passthrough to docker when fuzzy search is not enabled', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['123'],
        },
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql('docker start 123');
    });
  });

  describe('fuzzy enabled', async () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();

      // Enable fuzzy search
      mock(Config.prototype, sandbox, {
        prompt: { choice: ConfigOptions.FUZZY_SEARCH },
      });
      const command = new Config('enable');
      await command.run();

      // Disable caution
      mock(Config.prototype, sandbox, {
        prompt: { choice: ConfigOptions.CAUTION_CHECK },
      });
      const check = new Config('disable');
      await check.run();
    });

    afterEach(() => {
      sandbox.restore();
      deleteConfig();
    });

    it('should correctly fuzzy match the fully matched name', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['abc'],
        },
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql('docker start abc');
    });

    it('should correctly fuzzy match when typing part of the name', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['ab'],
        },
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql('docker start 123');
    });

    it('should correctly fuzzy match when id is fully matched', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['456'],
        },
      });

      const command = new Docker('start');
      expect(await command.run()).to.eql('docker start 456');
    });
  });
});
