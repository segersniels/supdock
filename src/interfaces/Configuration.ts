export const possibleValues = {
  'ask-for-confirmation':
    'When fuzzy searching is enabled we ask the user for confirmation before we execute the command. Default: enabled',
  'allow-fuzzy-search': 'Disable fuzzy searching. Default: disabled',
  'enable-short-logs':
    'Enforce a more readable log by limiting the length to 500 lines. Default: disabled',
};
export interface Configuration {
  'ask-for-confirmation': boolean;
  'allow-fuzzy-search': boolean;
  'enable-short-logs': boolean;
}
