
import { writeFileSync, readFileSync } from 'fs'
import { Configuration } from '../interfaces/Configuration' /* eslint-disable-line */
import { error } from './logger'

const homedir = require('os').homedir()
const path = `${homedir}/.supdock/config.json`
const defaultConfig: Configuration = {
  'ask-for-confirmation': true,
  'allow-fuzzy-search': false
}

const read = () => {
  let content: string
  try {
    content = readFileSync(path).toString()
    return JSON.parse(content) as Configuration
  } catch {
    return defaultConfig
  }
}

export const get = (key: string): Promise<string | boolean> => {
  const config: any = read()
  if (typeof config[key] === 'undefined') {
    if ((defaultConfig as any)[key]) {
      return (defaultConfig as any)[key]
    }
    error(`Unable to retrieve ${key} from the config`)
  }
  return config[key]
}

export const set = (key: string, value: boolean) => {
  const config: any = read()
  if (typeof (defaultConfig as any)[key] === 'undefined') {
    error(`Invalid config '${key}' detected`)
  }
  writeFileSync(path, JSON.stringify({
    ...config,
    [key]: value
  }))
}
