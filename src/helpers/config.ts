import { Configuration } from '../interfaces/Configuration' /* eslint-disable-line */
import { error } from './logger'
import { name } from '../../package.json'
import { homedir } from 'os'
import Configstore from 'configstore'

const defaultConfig: Configuration = {
  'ask-for-confirmation': true,
  'allow-fuzzy-search': false,
  'enable-short-logs': false
}

export default class Config {
  private get config (): Configstore {
    return new Configstore(name, defaultConfig, {
      configPath: `${homedir()}/.supdock/config.json`
    })
  }

  private get keys (): string[] {
    return Object.keys(this.config.all)
  }

  public get active (): string[] {
    return this.keys.filter(key => this.config.get(key))
  }

  public get inactive (): string[] {
    return this.keys.filter(key => !this.config.get(key))
  }

  public get = (key: string): boolean => {
    const value = this.config.get(key)
    if (typeof value === 'undefined') {
      error(`Unable to retrieve ${key} from the config`)
    }
    return value
  }

  public set = (key: string, value: boolean) => {
    if (typeof (defaultConfig as any)[key] === 'undefined') {
      error(`Invalid config '${key}' detected`)
    }
    this.config.set(key, value)
  }
}
