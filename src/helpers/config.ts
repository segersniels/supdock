import { Configuration } from '../interfaces/Configuration';
import { error } from './util';
import { name } from '../../package.json';
import { homedir } from 'os';
import Configstore from 'configstore';
import ConfigOptions from '../enums/ConfigOptions';

// When config is being adjusted make sure we keep track of the old values and names
const migrations: { [key: string]: any } = {
  '1': {
    [ConfigOptions.CAUTION_CHECK]: 'ask-for-confirmation',
    [ConfigOptions.FUZZY_SEARCH]: 'allow-fuzzy-search',
    [ConfigOptions.SHORT_LOGS]: 'enable-short-logs',
  },
};

const defaultConfig: Configuration = {
  [ConfigOptions.CAUTION_CHECK]: true,
  [ConfigOptions.FUZZY_SEARCH]: false,
  [ConfigOptions.SHORT_LOGS]: false,
};

export default class Config {
  private get config(): Configstore {
    return new Configstore(name, defaultConfig, {
      configPath: `${homedir()}/.supdock/config.json`,
    });
  }

  private get keys() {
    return Object.keys(this.config.all);
  }

  public migrate() {
    // Retain backward compatibility when users have an older config so iterate over configured migrations
    for (const key of this.keys) {
      for (const version of Object.keys(migrations)) {
        const migration = migrations[version];

        // Skip if there's no migration for requested config key
        if (!migration[key]) {
          continue;
        }

        // Config doesn't have the found migration
        if (!this.config.has(migration[key])) {
          continue;
        }

        // Override the new value with the old value
        this.set(key, this.config.get(migration[key]));

        // Remove the old value
        this.config.delete(migration[key]);
      }
    }
  }

  public get active() {
    return this.keys.filter(key => this.config.get(key));
  }

  public get inactive() {
    return this.keys.filter(key => !this.config.get(key));
  }

  public get = (key: string): boolean => {
    // Get the value from the config
    const value = this.config.get(key);

    if (typeof value === 'undefined') {
      error(`Unable to retrieve ${key} from the config`);
    }

    return value;
  };

  public set = (key: string, value: boolean) => {
    if (typeof (defaultConfig as any)[key] === 'undefined') {
      error(`Invalid config '${key}' detected`);
    }
    this.config.set(key, value);
  };
}
