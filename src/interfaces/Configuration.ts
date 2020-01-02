import ConfigOptions from '../enums/ConfigOptions';

export interface Configuration {
  [ConfigOptions.CAUTION_CHECK]: boolean;
  [ConfigOptions.FUZZY_SEARCH]: boolean;
  [ConfigOptions.SHORT_LOGS]: boolean;
}
