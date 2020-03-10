import 'mocha';
import Docker from 'commands/docker';
import { expect } from 'chai';
import ConfigOptions from 'enums/ConfigOptions';
import Config from 'commands/config';

describe('docker', () => {
  describe('fuzzy disabled', async () => {
    const command = new Config('disable', {
      prompt: () => ({ choice: ConfigOptions.FUZZY_SEARCH }),
    });
    await command.run();

    it('should correctly passthrough to docker', async () => {
      const command = new Docker('ps', {});
      expect(await command.run()).to.eql('docker ps');
    });

    it('should correctly log usage', async () => {
      const command = new Docker('ps', {
        parseFlags: () => ['--help'],
      });
      expect(await command.run()).to.eql('docker ps --help');
    });

    it('should correctly log usage of supdock command', async () => {
      const command = new Docker('start', {
        parseFlags: () => ['--help'],
      });
      await command.run();
    });

    it('should correctly execute supdock prompt command', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        determineChoice: () => '456 - foo',
      });
      expect(await command.run()).to.eql('docker start 456');
    });

    it('should correctly execute parallel prompt command', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['all'],
      });
      expect(await command.run()).to.eql(['123', '456', '789']);
    });

    it('should correctly execute parallel prompt command', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['all'],
      });
      expect(await command.run()).to.eql(['123', '456', '789']);
    });

    it('should correctly passthrough to docker when fuzzy search is not enabled', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['123'],
      });
      expect(await command.run()).to.eql('docker start 123');
    });
  });

  describe('fuzzy enabled', async () => {
    const command = new Config('enable', {
      prompt: () => ({ choice: ConfigOptions.FUZZY_SEARCH }),
    });
    await command.run();

    it('should correctly fuzzy match the fully matched name', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['abc'],
      });
      expect(await command.run()).to.eql('docker start abc');
    });

    it('should correctly fuzzy match when typing part of the name', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['ab'],
      });
      expect(await command.run()).to.eql('docker start 123');
    });

    it('should correctly fuzzy match when id is fully matched', async () => {
      const command = new Docker('start', {
        createChoices: () => ['123 - abc', '456 - foo', '789 - bar'],
        nonFlags: ['456'],
      });
      expect(await command.run()).to.eql('docker start 456');
    });
  });
});
