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
      await new Config('disable').run();

      mock(Docker.prototype, sandbox);
    });

    afterEach(() => {
      sandbox.restore();
      deleteConfig();
    });

    it('should correctly passthrough to docker', async () => {
      expect(await new Docker('ps').run()).to.eql('docker ps');
    });

    it('should correctly log usage', async () => {
      mock(Docker.prototype, sandbox, {
        args: {
          flags: {
            help: true,
          },
        },
      });

      expect(await new Docker('ps').run()).to.eql('docker ps --help');
    });

    it('should correctly log usage of supdock command', async () => {
      mock(Docker.prototype, sandbox, {
        args: {
          flags: {
            help: true,
          },
        },
      });

      await new Docker('start').usage();
    });

    it('should correctly execute supdock prompt command', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        determineChoice: '456 - foo',
      });

      expect(await new Docker('start').run()).to.eql('docker start 456');
    });

    it('should correctly execute parallel prompt command', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['all'],
        },
      });

      expect(await new Docker('start').run()).to.eql(['123', '456', '789']);
    });

    it('should correctly passthrough to docker when fuzzy search is not enabled', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['123'],
        },
      });

      expect(await new Docker('start').run()).to.eql('docker start 123');
    });
  });

  describe('fuzzy enabled', async () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();

      // Enable fuzzy search
      mock(Config.prototype, sandbox, {
        prompt: { choice: ConfigOptions.FUZZY_SEARCH },
      });
      await new Config('enable').run();

      // Disable caution
      mock(Config.prototype, sandbox, {
        prompt: { choice: ConfigOptions.CAUTION_CHECK },
      });
      await new Config('disable').run();
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

      expect(await new Docker('start').run()).to.eql('docker start abc');
    });

    it('should correctly fuzzy match when typing part of the name', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['ab'],
        },
      });

      expect(await new Docker('start').run()).to.eql('docker start 123');
    });

    it('should correctly fuzzy match when id is fully matched', async () => {
      mock(Docker.prototype, sandbox, {
        createChoices: ['123 - abc', '456 - foo', '789 - bar'],
        args: {
          nonFlags: ['456'],
        },
      });

      expect(await new Docker('start').run()).to.eql('docker start 456');
    });
  });
});
