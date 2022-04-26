import 'mocha';
import Config, { deleteConfig } from 'helpers/config';
import { expect } from 'chai';
import ConfigOptions from 'enums/ConfigOptions';

describe('config', () => {
  afterEach(() => {
    deleteConfig();
  });

  it('should correctly migrate old settings', () => {
    const configWithOldSettings = {
      'ask-for-confirmation': true,
      'allow-fuzzy-search': false,
      'enable-short-logs': false,
    };

    // Create config with old settings
    let config = new Config(configWithOldSettings as any);
    expect(config.get('ask-for-confirmation' as any)).to.eql(true);

    // Create a new config with new settings and migrate the old settings to the new ones
    config = new Config();
    config.migrate();

    const snapshot = config.list();
    expect(snapshot['ask-for-confirmation']).to.be.undefined;
    expect(config.get(ConfigOptions.CAUTION_CHECK)).to.eql(true);
  });
});
